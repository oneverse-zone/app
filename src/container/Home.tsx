import React from 'react';
import {Box, Button, IconButton} from 'native-base';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Profile} from './profile/Profile';
import {AddIcon} from 'native-base/src/components/primitives/Icon/Icons/Add';
import {navigate} from '../core/navigation';
import {route} from './router';

const Tab = createBottomTabNavigator();

export function HomeTab() {
  return <Box />;
}

export function Home() {
  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen name="HomeTab" component={HomeTab} />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerRight: () => (
            <IconButton
              icon={<AddIcon />}
              onPress={() => navigate(route.ProfilePersist)}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

(Home as any).options = {
  headerShown: false,
};
