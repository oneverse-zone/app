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
import { BackupOne } from './user/identify/backup/One';
import { BackupTwo } from './user/identify/backup/Two';
import { BackupThree } from './user/identify/backup/Three';
import { BackupFour } from './user/identify/backup/Four';
import { LockScreen } from './Lock';
import { BlockchainSelect } from './crypto-asset/blockchain/BlockchainSelect';
import { WalletSelect } from './crypto-asset/wallet/WalletSelect';
import { WalletCreate } from './crypto-asset/wallet/WalletCreate';
import { WalletRecover } from './crypto-asset/wallet/WalletRecover';
import { TokenDetail } from './crypto-asset/token/TokenDetail';
import { TokenSend } from './crypto-asset/token/TokenSend';

export const route = {
  Splash: 'Splash',

  /**
   * 锁屏
   */
  Lock: 'Lock',
  PinCode: 'PinCode',
  /**
   * 启动引导屏
   */
  OnBoarding: 'OnBoarding',
  Start: 'Start',

  ImportIdentify: 'ImportIdentify',
  RegisterOne: 'RegisterOne',
  RegisterTwo: 'RegisterTwo',
  BackupOne: 'BackupOne',
  BackupTwo: 'BackupTwo',
  BackupThree: 'BackupThree',
  BackupFour: 'BackupFour',

  Home: 'Home',

  ProfilePersist: 'ProfilePersist',
  Auth: 'Auth',

  BlockchainSelect: 'BlockchainSelect',
  WalletCreate: 'WalletCreate',
  WalletRecover: 'WalletRecover',
  WalletSelect: 'WalletSelect',
  TokenDetail: 'TokenDetail',
  TokenSend: 'TokenSend',

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
  {
    name: route.Lock,
    component: LockScreen,
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
    name: route.BackupOne,
    component: BackupOne,
  },
  {
    name: route.BackupTwo,
    component: BackupTwo,
  },
  {
    name: route.BackupThree,
    component: BackupThree,
  },
  {
    name: route.BackupFour,
    component: BackupFour,
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
    name: route.BlockchainSelect,
    component: BlockchainSelect,
  },
  {
    name: route.WalletCreate,
    component: WalletCreate,
  },
  {
    name: route.WalletRecover,
    component: WalletRecover,
  },
  {
    name: route.WalletSelect,
    component: WalletSelect,
  },
  {
    name: route.TokenDetail,
    component: TokenDetail,
  },
  {
    name: route.TokenSend,
    component: TokenSend,
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
