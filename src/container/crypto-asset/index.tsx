import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { autoBind } from 'jsdk/autoBind';
import { AddIcon, Box, Button, Row, Text } from 'native-base';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { MaterialTopTabNavigationOptions } from '@react-navigation/material-top-tabs/lib/typescript/src/types';
import { lang } from '../../locales';
import { walletService } from '../../services/Wallet';
import SendIcon from '../../assets/svg/arrow-up-from-bracket-solid.svg';

import { TokenScreen } from './token';
import { NFTScreen } from './NFT';
import { navigate } from '../../core/navigation';
import { route } from '../router';
import { WalletSelectButton } from './wallet/components/WalletSelectButton';
import { Empty } from './Empty';

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

/**
 * 加密资产
 */
@observer
@autoBind
export class CryptoAsset extends Component<any, any> {
  static options = {
    headerRight: () => <AddIcon />,
    headerLeft: (props: any) => <WalletSelectButton {...props} />,
  };

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

  render() {
    const { totalAmount, wallets } = walletService;
    if (wallets.length === 0) {
      return <Empty {...this.props} />;
    }
    return (
      <Box flex={1}>
        <Box
          borderRadius="lg"
          margin={3}
          padding={3}
          backgroundColor="primary.500"
          minH={120}
          justifyContent="space-between">
          <Text fontWeight="500" fontSize="2xl" color="white">
            {totalAmount}
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
      </Box>
    );
  }
}
