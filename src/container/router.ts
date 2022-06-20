import React from 'react';
import { Splash } from './Splash';
import { Home } from './Home';
import { ImportIdentify } from './identify/Import';
import { ProfilePersist } from './profile/Persist';
import { Auth } from './Auth';
import { OnBoarding } from './OnBoarding';
import { Start } from './Start';
import { PinCode } from './PinCode';

export const route = {
  Splash: 'Splash',

  PinCode: 'PinCode',
  /**
   * 启动引导屏
   */
  OnBoarding: 'OnBoarding',
  Start: 'Start',

  ImportIdentify: 'ImportIdentify',
  RegisterOne: 'RegisterOne',
  RegisterTwo: 'RegisterTwo',

  Home: 'Home',

  ProfilePersist: 'ProfilePersist',
  Auth: 'Auth',
};

export const routers: Array<{
  name: string;
  component: React.ComponentType;
}> = [
  {
    name: route.Splash,
    component: Splash,
  },
  {
    name: route.OnBoarding,
    component: OnBoarding,
  },
  {
    name: route.Start,
    component: Start,
  },
  {
    name: route.PinCode,
    component: PinCode,
  },
  {
    name: route.ImportIdentify,
    component: ImportIdentify,
  },
  {
    name: route.Home,
    component: Home,
  },
  {
    name: route.ProfilePersist,
    component: ProfilePersist,
  },
  {
    name: route.Auth,
    component: Auth,
  },
];
