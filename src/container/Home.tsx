import React from 'react';
import { Box, Button, IconButton } from 'native-base';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Profile } from './profile/Profile';
import { AddIcon } from 'native-base/src/components/primitives/Icon/Icons/Add';
import web3 from 'web3';
import { navigate } from '../core/navigation';
import { route } from './router';

const Tab = createBottomTabNavigator();

export function HomeTab() {
  function create() {
    console.log(web3);
  }

  return <Button onPress={create}>{'创建钱包'}</Button>;
}

const tabs: Array<Screen> = [];

export function Home() {
  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen name="HomeTab" component={HomeTab} />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerRight: () => <IconButton icon={<AddIcon />} onPress={() => navigate(route.ProfilePersist)} />,
        }}
      />
    </Tab.Navigator>
  );
}

(Home as any).options = {
  headerShown: false,
};
