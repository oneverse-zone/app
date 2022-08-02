import React, { Component } from 'react';
import { Page } from '../../components/Page';
import { userService } from '../../services/User';
import { observer } from 'mobx-react';
import { autoBind } from 'jsdk/autoBind';
import { Box, Column, IconButton, Row, Text } from 'native-base';
import { lang } from '../../locales';
import { route } from '../router';
import { ListItem } from '../../components/ListItem';
import { navigate } from '../../core/navigation';
import { AddIcon } from 'native-base/src/components/primitives/Icon/Icons/Add';

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
    headerRight: () => <IconButton icon={<AddIcon />} onPress={() => navigate(route.ProfilePersist)} />,
  };

  constructor(props: any) {
    super(props);
    userService.queryProfile();
  }

  render() {
    const { basicProfile } = userService;
    return (
      <Page>
        <Box pl="4" pr="5" py="2">
          <Row space={3} justifyContent="space-between">
            <Column>
              <Text
                _dark={{
                  color: 'warmGray.50',
                }}
                color="coolGray.800"
                bold>
                {basicProfile?.name}
              </Text>
              <Text
                color="coolGray.600"
                _dark={{
                  color: 'warmGray.200',
                }}>
                {basicProfile?.email as any}
              </Text>
            </Column>
          </Row>
        </Box>
        {functions.map((item, index) => (
          <ListItem {...item} key={index} />
        ))}
      </Page>
    );
  }
}
