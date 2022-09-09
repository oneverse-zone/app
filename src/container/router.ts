import React from 'react';
import { Splash } from './Splash';
import { Home } from './Home';
import { PasswordSetting } from './PasswordSetting';
import { ImportIdentify } from './user/identify/Import';
import { ProfilePersist } from './user/profile/Persist';
import { Auth } from './Auth';
import { OnBoarding } from './OnBoarding';
import { Start } from './Start';
import { Setting } from './setting';
import { RegisterTwo } from './user/identify/register/Two';
import { BackupOne } from './backup/One';
import { BackupTwo } from './backup/Two';
import { BackupThree } from './backup/Three';
import { BackupFour } from './backup/Four';
import { LockScreen } from './Lock';
import { BlockchainSelect } from './crypto-asset/blockchain/BlockchainSelect';
import { WalletManager } from './crypto-asset/wallet/wallet-manager';
import { WalletCreate } from './crypto-asset/wallet/WalletCreate';
import { WalletRecover } from './crypto-asset/wallet/WalletRecover';
import { TokenDetail } from './crypto-asset/token/TokenDetail';
import { TokenTransfer } from './crypto-asset/token/token-transfer';
import { TokenReceive } from './crypto-asset/token/TokenReceive';
import { GasSetting } from './crypto-asset/gas/gas-setting';
import { TokenManager } from './crypto-asset/token/token-manager';
import { TokenPersist } from './crypto-asset/token/token-persist';
import { TokenTransferConfirm } from './crypto-asset/token/token-transfer-confirm';

export const route = {
  Splash: 'Splash',

  /**
   * 锁屏
   */
  Lock: 'Lock',
  PasswordSetting: 'PasswordSetting',
  PinCode: 'PinCode',
  /**
   * 启动引导屏
   */
  OnBoarding: 'OnBoarding',
  Start: 'Start',

  ImportIdentify: 'ImportIdentify',
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
  WalletManager: 'WalletManager',
  TokenDetail: 'TokenDetail',
  TokenTransfer: 'TokenTransfer',
  TokenTransferConfirm: 'TokenTransferConfirm',
  TokenReceive: 'TokenReceive',
  TokenSelect: 'TokenSelect',
  TokenManager: 'TokenManager',
  TokenPersist: 'TokenPersist',
  GasSetting: 'GasSetting',

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
    name: route.PasswordSetting,
    component: PasswordSetting,
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
    name: route.WalletManager,
    component: WalletManager,
  },
  {
    name: route.TokenDetail,
    component: TokenDetail,
  },
  {
    name: route.TokenTransfer,
    component: TokenTransfer,
  },
  {
    name: route.TokenTransferConfirm,
    component: TokenTransferConfirm,
  },
  {
    name: route.TokenReceive,
    component: TokenReceive,
  },
  {
    name: route.TokenManager,
    component: TokenManager,
  },
  {
    name: route.TokenPersist,
    component: TokenPersist,
  },
  // {
  //   name: route.TokenSelect,
  //   component: TokenSelect,
  // },
  {
    name: route.GasSetting,
    component: GasSetting,
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
