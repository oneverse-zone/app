import React, { Component } from 'react';
import { autoBind } from 'jsdk/autoBind';
import { Actionsheet, Box, Heading, Text } from 'native-base';
import { Button } from '../../components/Button';
import { lang } from '../../locales';
import { Page } from '../../components/Page';

const config = {
  create: {
    title: lang('wallet.create'),
    items: [
      {
        title: lang('wallet.create.hd'),
        describe: lang('wallet.create.hd.describe'),
      },
      {
        title: lang('wallet.create.default'),
        describe: lang('wallet.create.default.describe'),
      },
    ],
  },
  recover: {
    title: lang('wallet.recover'),
    items: [
      {
        title: lang('wallet.recover.hd'),
        describe: lang('wallet.recover.hd.describe'),
      },
      {
        title: lang('wallet.recover.default'),
        describe: lang('wallet.recover.default.describe'),
      },
    ],
  },
};

@autoBind
export class Empty extends Component<any, any> {
  state: { open: boolean; type: keyof typeof config } = {
    open: false,
    type: 'create',
  };

  constructor(props: any) {
    super(props);
    props.navigation.setOptions({ headerShown: false });
  }

  openSwitch() {
    this.setState({ open: !this.state.open });
  }

  handleCreate() {
    this.setState({ open: true, type: 'create' });
  }

  handleRecover() {
    this.setState({ open: true, type: 'recover' });
  }

  handleItemPress(item: any) {}

  render() {
    const { open, type } = this.state;
    const footer = (
      <Actionsheet isOpen={open} onClose={this.openSwitch}>
        <Actionsheet.Content>
          <Box w="100%" h={60} px={4} justifyContent="center" alignItems="center">
            <Text color="coolGray.500">{config[type].title}</Text>
          </Box>
          {config[type].items.map((item, index) => (
            <Actionsheet.Item key={index} onPress={() => this.handleItemPress(item)}>
              <Text fontWeight="500" fontSize="md">
                {item.title}
              </Text>
              <Text fontSize="xs" color="coolGray.500">
                {item.describe}
              </Text>
            </Actionsheet.Item>
          ))}
          <Actionsheet.Item alignItems="center" onPress={this.openSwitch}>
            {lang('cancel')}
          </Actionsheet.Item>
        </Actionsheet.Content>
      </Actionsheet>
    );

    return (
      <Page safeAreaTop footer={footer}>
        <Button onPress={this.handleCreate}>{lang('wallet.create')}</Button>
        <Button onPress={this.handleRecover}>{lang('wallet.recover')}</Button>
      </Page>
    );
  }
}
