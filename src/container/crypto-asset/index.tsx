import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { autoBind } from 'jsdk/autoBind';
import { createMaterialTopTabNavigator, MaterialTopTabBar } from '@react-navigation/material-top-tabs';
import {
  MaterialTopTabBarProps,
  MaterialTopTabNavigationOptions,
} from '@react-navigation/material-top-tabs/lib/typescript/src/types';
import { lang } from '../../locales';

import { Wallet } from './Wallet';
import { AddIcon, Box } from 'native-base';
import { walletService } from '../../services/Wallet';
import { Empty } from './Empty';

const Tab = createMaterialTopTabNavigator();

const tabs: Record<
  string,
  MaterialTopTabNavigationOptions & {
    component: React.ComponentType<any>;
  }
> = {
  Token: {
    title: lang('token'),
    component: Wallet,
  },
  NFT: {
    title: lang('nft'),
    component: Wallet,
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
    return (
      <Tab.Navigator initialRouteName="Token">
        {Object.keys(tabs).map(key => {
          const { component, ...options } = tabs[key];
          return <Tab.Screen name={key} key={key} component={component} options={options} />;
        })}
      </Tab.Navigator>
    );
  }
}
