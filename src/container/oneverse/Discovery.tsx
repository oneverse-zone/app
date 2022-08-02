import React, { Component } from 'react';
import { Box } from 'native-base';
import { MaterialTopTabNavigationOptions } from '@react-navigation/material-top-tabs/lib/typescript/src/types';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SearchBar } from '../../components/SearchBar';

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

function All() {
  return <Box></Box>;
}

const tabs: Record<
  string,
  MaterialTopTabNavigationOptions & {
    component: React.ComponentType<any>;
  }
> = {
  All: {
    component: All,
  },
  Nft: {
    component: All,
  },
  DeFi: {
    component: All,
  },
  GameFi: {
    component: All,
  },
};

/**
 * 发现
 */
export class Discovery extends Component<any, any> {
  render() {
    return (
      <Box flex={1} bgColor="white">
        <Box paddingX={3}>
          <SearchBar />
        </Box>
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
