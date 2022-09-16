import React, { Component } from 'react';
import { Page } from '../../components/Page';
import { userService } from '../../services/User';
import { observer } from 'mobx-react';
import { autoBind } from 'jsdk/autoBind';
import { Avatar, Box, Column, IconButton, Image, Row, Text, Toast } from 'native-base';
import { lang } from '../../locales';
import { route } from '../router';
import { ListItem } from '../../components/ListItem';
import { navigate } from '../../core/navigation';
import { AddIcon } from 'native-base/src/components/primitives/Icon/Icons/Add';
import { sessionService } from '../../services/Session';
import { CopyText } from '../../components/CopyText';
import Clipboard from '@react-native-clipboard/clipboard';
import { UserAvatar } from '../../components/UserAvatar';
import defaultBg from '../../assets/user-default-background.webp';

const functions = [
  {
    title: lang('setting'),
    onPress: () => navigate(route.Setting),
  },
];

@observer
@autoBind
export class User extends Component<any, any> {
  static options = {
    headerTransparent: true,
    headerRight: () => <IconButton icon={<AddIcon />} onPress={() => navigate(route.Setting)} />,
  };

  constructor(props: any) {
    super(props);
    userService.queryProfile();
  }

  handleCopy() {
    const { id } = sessionService;
    Clipboard.setString(id ?? '');
    Toast.show({
      placement: 'top',
      description: lang('copy.success'),
    });
  }

  handleGoProfile() {
    navigate(route.UserProfile);
  }

  render() {
    const { id } = sessionService;
    const { loading, basicProfile } = userService;

    return (
      <Page refreshing={loading} onRefresh={userService.queryProfile}>
        <Image
          height={300}
          width="full"
          source={{ uri: basicProfile?.background?.original.src }}
          defaultSource={defaultBg}
          alt={basicProfile?.name ?? '-'}
        />
        <ListItem
          icon={<UserAvatar />}
          title={`${basicProfile?.name ?? (id?.substring(id?.length - 12) || 'xxx')}`}
          subtitle={`DID: ${id}`}
          subtitleProps={{
            ellipsizeMode: 'middle',
            numberOfLines: 1,
            width: '3/6',
            color: 'coolGray.500',
            onPress: this.handleCopy,
          }}
          showArrow
          onPress={this.handleGoProfile}
        />
      </Page>
    );
  }
}
