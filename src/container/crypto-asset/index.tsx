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
  };

  render() {
    // const { list } = walletService;
    // if (list.length === 0) {
    //   return <Empty {...this.props} />;
    // }
    const { totalAmount } = walletService;
    return (
      <Box flex={1}>
        <Box borderRadius="lg" margin={3} padding={3} backgroundColor="primary.500" minH={120}>
          <Text>{totalAmount}</Text>
          <Row>
            <Button
              size="sm"
              variant="ghost"
              _text={{ color: 'white' }}
              leftIcon={<SendIcon color="white" width={16} height={16} fill="white" />}>
              {lang('token.send')}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              _text={{ color: 'white' }}
              leftIcon={<SendIcon color="white" width={16} height={16} fill="white" />}>
              {lang('token.receive')}
            </Button>
          </Row>
        </Box>
        <Box flex={1}>
          <Tab.Navigator initialRouteName="Token">
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
