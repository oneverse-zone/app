import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { autoBind } from 'jsdk/autoBind';
import { Actionsheet, Box, Column, Text } from 'native-base';
import { Button } from '../../components/Button';
import { lang } from '../../locales';
import { Page } from '../../components/Page';
import { PageTitle } from '../../components/PageTitle';
import { walletManagerService } from '../../services/wallet-manager';

const items = [
  {
    title: lang('wallet.create.default'),
    describe: lang('wallet.create.default.describe'),
  },
  {
    title: lang('wallet.recover.default'),
    describe: lang('wallet.recover.default.describe'),
  },
];

@observer
@autoBind
export class Empty extends Component<any, any> {
  state: { open: boolean } = {
    open: false,
  };

  componentDidMount() {
    this.props.navigation.setOptions({ headerShown: false });
  }

  componentWillUnmount() {
    this.props.navigation.setOptions({ headerShown: true });
  }

  async handleInitHd() {
    await walletManagerService.initDIDHDWallet('');
  }

  openSwitch() {
    this.setState({ open: !this.state.open });
  }

  handleItemPress(item: any) {}

  render() {
    const { loading } = walletManagerService;
    const { open } = this.state;
    const footer = (
      <Actionsheet isOpen={open} onClose={this.openSwitch}>
        <Actionsheet.Content>
          <Box w="100%" h={60} px={4} justifyContent="center" alignItems="center">
            <Text color="coolGray.500">{lang('wallet.single-chain.init')}</Text>
          </Box>
          {items.map((item, index) => (
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
      <Page safeAreaTop footer={footer} loading={loading}>
        <PageTitle title={lang('wallet.welcome.title')} description={lang('wallet.welcome.slogan')} marginTop={70} />

        <Column space={3} justifyContent="flex-end" alignItems="center" flex={1} safeAreaBottom mb={20}>
          <Button
            variant="outline"
            onPress={this.openSwitch}
            borderColor="primary.500"
            width={250}
            _text={{ fontSize: 'sm' }}>
            {lang('wallet.single-chain.init')}
          </Button>
          <Button onPress={this.handleInitHd} width={250} _text={{ fontSize: 'sm' }}>
            {lang('wallet.hd.init')}
          </Button>
        </Column>
      </Page>
    );
  }
}
