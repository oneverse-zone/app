import React from 'react';
import { NativeBaseProvider } from 'native-base';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { route, routers } from './router';
import { navigationRef } from '../core/navigation';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NativeBaseProvider>
      <NavigationContainer
        ref={navigationRef}
        linking={{
          prefixes: ['oneverse://'],
          config: {
            screens: {
              [route.Auth]: 'auth',
            },
          },
        }}>
        <Stack.Navigator
          initialRouteName={route.Splash}
          defaultScreenOptions={{ statusBarStyle: 'dark', headerBackTitleVisible: false }}>
          {routers.map(({ component, ...route }, index) => (
            <Stack.Screen {...route} key={index} component={component} options={(component as any).options} />
          ))}
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
