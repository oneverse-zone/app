import React, { Component } from 'react';
import { Box } from 'native-base';
import { autoBind } from 'jsdk/autoBind';
import { observer } from 'mobx-react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { MaterialTopTabNavigationOptions } from '@react-navigation/material-top-tabs/lib/typescript/src/types';
import { Discovery } from './Discovery';
import { Follow } from './Follow';
import { lang } from '../../locales';

const Tab = createMaterialTopTabNavigator();

const commonOptions: MaterialTopTabNavigationOptions = {
  tabBarScrollEnabled: true,
  tabBarStyle: {
    alignContent: 'center',
  },
  tabBarItemStyle: {
    width: 'auto',
  },
};

const tabs: Record<
  string,
  MaterialTopTabNavigationOptions & {
    component: React.ComponentType<any>;
  }
> = {
  Discovery: {
    title: lang('discovery'),
    component: Discovery,
  },
  Follow: {
    title: lang('follow'),
    component: Follow,
  },
};

/**
 * OneVerse
 */
@observer
@autoBind
export class OneVerse extends Component<any, any> {
  static options = {
    headerShown: false,
  };

  render() {
    return (
      <Box flex={1} safeAreaTop backgroundColor="white">
        <Tab.Navigator initialRouteName="Token" screenOptions={commonOptions}>
          {Object.keys(tabs).map(key => {
            const { component, ...options } = tabs[key];
            return <Tab.Screen name={key} key={key} component={component} options={options} />;
          })}
        </Tab.Navigator>
      </Box>
    );
  }
}
