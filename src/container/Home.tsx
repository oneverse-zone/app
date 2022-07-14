import React from 'react';
import { Icon, IconButton, View } from 'native-base';
import { BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { AddIcon } from 'native-base/src/components/primitives/Icon/Icons/Add';
import { navigate } from '../core/navigation';
import { route } from './router';
import ContactsIcon from '../assets/svg/contacts.svg';
import { lang } from '../locales';

import { User } from './user/User';
import { CryptoAsset } from './crypto-asset';
import { AppCenter } from './app-center';
import { WalletSelectButton } from './crypto-asset/wallet/WalletSelectButton';

const Tab = createBottomTabNavigator();

export function HomeTab() {
  return <View />;
}

/**
 * 首页tab配置
 */
const tabs: Record<
  string,
  BottomTabNavigationOptions & { component: React.ComponentType<any>; icon?: React.ReactNode }
> = {
  Index: {
    title: lang('tab.home'),
    component: HomeTab,
    icon: <MaterialIcons name="home" />,
  },
  CryptoAsset: {
    title: lang('tab.crypto-asset'),
    component: CryptoAsset,
    icon: <MaterialIcons name="account-balance-wallet" />,
    headerLeft: (props: any) => <WalletSelectButton {...props} />,
  },
  AppCenter: {
    tabBarLabel: () => null,
    component: AppCenter,
    icon: <MaterialIcons name="public" />,
  },
  Message: {
    title: lang('tab.message'),
    component: HomeTab,
    icon: <MaterialIcons name="chat" />,
    headerRight: () => {
      return (
        <>
          <IconButton icon={<ContactsIcon width={25} height={25} fill="#000" />} />
        </>
      );
    },
  },
  User: {
    title: lang('tab.user'),
    component: User,
    icon: <MaterialIcons name="person" />,
    headerRight: () => <IconButton icon={<AddIcon />} onPress={() => navigate(route.ProfilePersist)} />,
  },
};

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
