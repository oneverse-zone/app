import React, {useEffect} from 'react';
import {Center, Text} from 'native-base';
import {sessionService} from '../services/Session';
import {resetTo} from '../core/navigation';
import {Route} from './router';

export function SplashScreen() {
  useEffect(() => {
    setTimeout(() => {
      console.log(sessionService.authenticate());
      resetTo(sessionService.authenticate() ? Route.Home : Route.Login);
    }, 500);
  }, []);

  return (
    <Center flex={1}>
      <Text>{'欢迎来到 OneVerse'}</Text>
      <Text>{'您将主宰自己的一切'}</Text>
    </Center>
  );
}

SplashScreen.options = {headerShown: false};
