import React, { Component } from 'react';
import { userService } from '../../../services/User';
import { observer } from 'mobx-react';
import { autoBind } from 'jsdk/autoBind';
import { Box, Center, Pressable, Text } from 'native-base';
import { ListItem } from '../../../components/ListItem';
import { UserAvatar } from '../../../components/UserAvatar';
import { lang } from '../../../locales';
import { sessionService } from '../../../services/Session';
import { CopyText } from '../../../components/CopyText';
import { DeviceEventEmitter } from 'react-native';
import { singleInputService } from '../../../services/SingleInput';
import { MediaActionSheet } from '../../../components/MediaActionSheet';

function renderItemValue({ value }: { value?: string }) {
  return <Text>{value}</Text>;
}

const events = {
  editUserName: 'user.name.setting',
  editUserIntroduce: 'user.introduce.setting',
};

@observer
@autoBind
export class UserProfile extends Component<any, any> {
  static options = {
    // headerShown: false,
    headerBackTitleVisible: false,
    title: lang('user.profile'),
  };

  state = {
    mediaOpen: false,
  };

  constructor(props: any) {
    super(props);
    userService.queryProfile();
  }

  componentWillUnmount() {
    DeviceEventEmitter.removeAllListeners(events.editUserName);
  }

  handleEditName() {
    const { basicProfile } = userService;
    singleInputService.go({
      title: lang('user.name.setting'),
      helperText: '',
      defaultValue: basicProfile?.name,
      async onOk(name) {
        await userService.updateProfile({ name });
      },
    });
  }
  handleEditIntroduce() {
    const { basicProfile } = userService;
    singleInputService.go({
      title: lang('user.introduce.setting'),
      helperText: '',
      defaultValue: basicProfile?.description,
      async onOk(description) {
        await userService.updateProfile({ description });
      },
    });
  }

  switchMediaActionSheet() {
    this.setState({ mediaOpen: !this.state.mediaOpen });
  }

  render() {
    const { id } = sessionService;
    const { basicProfile } = userService;
    return (
      <Box flex={1}>
        <Center padding={3}>
          <Pressable onPress={this.switchMediaActionSheet}>
            <UserAvatar size="lg" />
          </Pressable>
          <CopyText width="3/5" mt={1}>
            {id ?? ''}
          </CopyText>
        </Center>
        <ListItem
          title={lang('name')}
          onPress={this.handleEditName}
          footer={renderItemValue({ value: basicProfile?.name })}
        />
        <ListItem
          title={lang('introduce')}
          onPress={this.handleEditIntroduce}
          footer={renderItemValue({ value: basicProfile?.description })}
        />
        {/*<ListItem title={lang('gender')} footer={renderItemValue({ value: basicProfile?.gender })} />*/}
        {/*<ListItem title={lang('birthdate')} footer={renderItemValue({ value: basicProfile?.birthDate })} />*/}
        <MediaActionSheet
          isOpen={this.state.mediaOpen}
          onClose={this.switchMediaActionSheet}
          onFinish={userService.updateAvatar}
          options={{
            allowsEditing: true,
          }}
        />
      </Box>
    );
  }
}
