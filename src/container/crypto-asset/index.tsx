import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { autoBind } from 'jsdk/autoBind';
import { AddIcon, Box, Button, IconButton, Row, Text } from 'native-base';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { MaterialTopTabNavigationOptions } from '@react-navigation/material-top-tabs/lib/typescript/src/types';
import { lang } from '../../locales';
import SendIcon from '../../assets/svg/arrow-up-from-bracket-solid.svg';

import { TokenScreen } from './token';
import { NFTScreen } from './NFT';
import { navigate } from '../../core/navigation';
import { route } from '../router';
import { WalletSelectButton } from './components/WalletSelectButton';
import { Empty } from './Empty';
import { walletManagerService } from '../../services/blockchain/wallet-manager';
import { WalletNewActionSheet } from './components/WalletNewActionSheet';
import { Page } from '../../components/Page';

const commonOptions: MaterialTopTabNavigationOptions = {
  tabBarStyle: {
    alignContent: 'center',
  },
  tabBarItemStyle: {
    // width: 'auto',
    height: 50,
  },
  tabBarLabelStyle: {
    fontWeight: '500',
  },
};

const Tab = createMaterialTopTabNavigator();

const tabs: Record<
  string,
  MaterialTopTabNavigationOptions & {
    component: React.ComponentType<any>;
  }
> = {
  Token: {
    title: lang('token'),
    component: TokenScreen,
  },
  NFT: {
    title: lang('nft'),
    component: NFTScreen,
  },
};

function WalletAddButton({ navigation }: any) {
  function handlePress() {
    navigation.setParams({ open: true });
  }

  return <IconButton borderRadius="full" icon={<AddIcon />} onPress={handlePress} />;
}

/**
 * 加密资产
 */
@observer
@autoBind
export class CryptoAsset extends Component<any, any> {
  static options = (props: any) => ({
    headerLeft: WalletSelectButton,
    headerRight: () => <WalletAddButton {...props} />,
  });

  openSwitch() {
    const { open } = this.props.route.params || {};
    this.props.navigation.setParams({ open: !open });
  }

  handleSend() {
    navigate(route.TokenSelect, {
      nextRoute: route.TokenSend,
    });
  }

  handleReceive() {
    navigate(route.TokenSelect, {
      nextRoute: route.TokenReceive,
    });
  }

  renderDefault() {
    return (
      <>
        <Box
          borderRadius="lg"
          margin={3}
          padding={3}
          backgroundColor="primary.500"
          minH={120}
          justifyContent="space-between">
          <Text fontWeight="500" fontSize="2xl" color="white">
            {0}
          </Text>
          <Row>
            <Button
              size="sm"
              variant="ghost"
              _text={{ color: 'white' }}
              leftIcon={<SendIcon color="white" width={16} height={16} fill="white" />}
              onPress={this.handleSend}>
              {lang('token.send')}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              _text={{ color: 'white' }}
              leftIcon={<SendIcon color="white" width={16} height={16} fill="white" />}
              onPress={this.handleReceive}>
              {lang('token.receive')}
            </Button>
          </Row>
        </Box>
        <Box flex={1}>
          <Tab.Navigator initialRouteName="Token" screenOptions={commonOptions}>
            {Object.keys(tabs).map(key => {
              const { component, ...options } = tabs[key];
              return <Tab.Screen name={key} key={key} component={component} options={options} />;
            })}
          </Tab.Navigator>
        </Box>
      </>
    );
  }

  render() {
    const { wallet, wallets, loading } = walletManagerService;
    const { open } = this.props.route.params || {};
    return (
      <Page loading={loading} scroll={false}>
        {wallets.length === 0 ? <Empty onOpen={this.openSwitch} {...(this.props as any)} /> : this.renderDefault()}
        <WalletNewActionSheet didWallet={wallet} isOpen={open} onClose={this.openSwitch} />
      </Page>
    );
  }
}
