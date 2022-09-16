import React from 'react';
import { Icon } from 'native-base';
import { BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { lang } from '../locales';

import { User } from './user/User';
import { CryptoAsset } from './crypto-asset';
import { AppCenter } from './app-center';
import { OneVerse } from './oneverse';
import { Message } from './message';

/**
 * 首页tab配置
 */
const tabs: Record<
  string,
  BottomTabNavigationOptions & { component: React.ComponentType<any>; icon?: React.ReactNode }
> = {
  Index: {
    title: lang('tab.home'),
    component: OneVerse,
    icon: <MaterialIcons name="home" />,
  },
  CryptoAsset: {
    title: lang('tab.crypto-asset'),
    component: CryptoAsset,
    icon: <MaterialIcons name="account-balance-wallet" />,
  },
  AppCenter: {
    tabBarLabel: () => null,
    component: AppCenter,
    icon: <MaterialIcons name="blur-on" />,
  },
  Message: {
    title: lang('tab.message'),
    component: Message,
    icon: <MaterialIcons name="chat" />,
  },
  User: {
    title: '',
    tabBarLabel: lang('tab.user'),
    component: User,
    icon: <MaterialIcons name="person" />,
  },
};

const Tab = createBottomTabNavigator();

/**
 * 首页
 */
export function Home() {
  return (
    <Tab.Navigator initialRouteName="Index">
      {Object.keys(tabs).map(key => {
        const { component, icon, ...options } = tabs[key];

        function optionsProxy(props: any): BottomTabNavigationOptions {
          let base: BottomTabNavigationOptions = {
            ...options,
            tabBarIcon: ({ size, color }) => {
              return <Icon size={size + (key === 'AppCenter' ? 12 : 0)} color={color} as={icon} />;
            },
          };
          if (typeof (component as any).options === 'function') {
            return {
              ...base,
              ...(component as any).options(props),
            };
          }
          return {
            ...base,
            ...(component as any).options,
          };
        }

        return <Tab.Screen name={key} key={key} component={component} options={optionsProxy} />;
      })}
    </Tab.Navigator>
  );
}

(Home as any).options = {
  headerShown: false,
};
