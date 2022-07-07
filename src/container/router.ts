import React from 'react';
import { Splash } from './Splash';
import { Home } from './Home';
import { RegisterOne } from './user/identify/register/One';
import { ImportIdentify } from './user/identify/Import';
import { ProfilePersist } from './user/profile/Persist';
import { Auth } from './Auth';
import { OnBoarding } from './OnBoarding';
import { Start } from './Start';
import { Setting } from './setting';
import { RegisterTwo } from './user/identify/register/Two';
import { AccountBackup } from './user/identify/Backup';

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
  AccountBackup: 'AccountBackup',

  Home: 'Home',

  ProfilePersist: 'ProfilePersist',
  Auth: 'Auth',

  Setting: 'Setting',
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
  // {
  //   name: route.PinCode,
  //   component: PinCode,
  // },
  {
    name: route.RegisterOne,
    component: RegisterOne,
  },
  {
    name: route.RegisterTwo,
    component: RegisterTwo,
  },
  {
    name: route.AccountBackup,
    component: AccountBackup,
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
  {
    name: route.Setting,
    component: Setting,
  },
];
