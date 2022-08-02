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
    ...OneVerse.options,
  },
  CryptoAsset: {
    title: lang('tab.crypto-asset'),
    component: CryptoAsset,
    icon: <MaterialIcons name="account-balance-wallet" />,
    ...CryptoAsset.options,
  },
  AppCenter: {
    tabBarLabel: () => null,
    component: AppCenter,
    icon: <MaterialIcons name="blur-on" />,
    ...AppCenter.options,
  },
  Message: {
    title: lang('tab.message'),
    component: Message,
    icon: <MaterialIcons name="chat" />,
    ...Message.options,
  },
  User: {
    title: lang('tab.user'),
    component: User,
    icon: <MaterialIcons name="person" />,
    ...User.options,
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
        return (
          <Tab.Screen
            name={key}
            key={key}
            component={component}
            options={{
              ...options,
              tabBarIcon: ({ size, color }) => {
                return <Icon size={size + (key === 'AppCenter' ? 12 : 0)} color={color} as={icon} />;
              },
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
}

(Home as any).options = {
  headerShown: false,
};
