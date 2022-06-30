import React from 'react';
import { Button, IconButton } from 'native-base';
import { BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AddIcon } from 'native-base/src/components/primitives/Icon/Icons/Add';
import { navigate } from '../core/navigation';
import { route } from './router';

import HomeIcon from '../assets/svg/home.svg';
import WalletIcon from '../assets/svg/wallet.svg';
import MessageIcon from '../assets/svg/message.svg';
import UserIcon from '../assets/svg/user.svg';
import ContactsIcon from '../assets/svg/contacts.svg';
import { lang } from '../locales';

import { User } from './user/User';
import { CryptoAsset } from './crypto-asset';
import { walletService } from '../services/Wallet';

const Tab = createBottomTabNavigator();

export function HomeTab() {
  function create() {
    walletService.create('ETC', '');
  }

  return <Button onPress={create}>{'创建钱包'}</Button>;
}

/**
 * 首页tab配置
 */
const tabs: Record<
  string,
  BottomTabNavigationOptions & { component: React.ComponentType<any>; icon?: React.ComponentType<any> }
> = {
  Index: {
    title: lang('tab.home'),
    component: HomeTab,
    icon: HomeIcon,
  },
  CryptoAsset: {
    title: lang('tab.crypto-asset'),
    component: CryptoAsset,
    icon: WalletIcon,
    headerShown: false,
  },
  Message: {
    title: lang('tab.message'),
    component: HomeTab,
    icon: MessageIcon,
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
    icon: UserIcon,
    headerRight: () => <IconButton icon={<AddIcon />} onPress={() => navigate(route.ProfilePersist)} />,
  },
};

export function Home() {
  return (
    <Tab.Navigator initialRouteName="Index">
      {Object.keys(tabs).map(key => {
        const { component, icon: Icon, ...options } = tabs[key];

        return (
          <Tab.Screen
            name={key}
            key={key}
            component={component}
            options={{
              ...options,
              tabBarIcon: ({ size, color }) => {
                return Icon && <Icon width={size} height={size} fill={color} />;
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
