import React from 'react';
import { Splash } from '../container/Splash';
import { Home } from '../container/Home';
import { PasswordSetting } from '../container/PasswordSetting';
import { ImportIdentify } from '../container/user/identify/Import';
import { ProfilePersist } from '../container/user/profile/Persist';
import { Auth } from '../container/Auth';
import { OnBoarding } from '../container/OnBoarding';
import { Start } from '../container/Start';
import { Setting } from '../container/setting';
import { RegisterTwo } from '../container/user/identify/register/Two';
import { BackupOne } from '../container/backup/One';
import { BackupTwo } from '../container/backup/Two';
import { BackupThree } from '../container/backup/Three';
import { BackupFour } from '../container/backup/Four';
import { LockScreen } from '../container/Lock';
import { BlockchainSelect } from '../container/crypto-asset/blockchain/BlockchainSelect';
import { WalletManager } from '../container/crypto-asset/wallet/wallet-manager';
import { WalletCreate } from '../container/crypto-asset/wallet/WalletCreate';
import { WalletRecover } from '../container/crypto-asset/wallet/WalletRecover';
import { TokenDetail } from '../container/crypto-asset/token/TokenDetail';
import { TokenTransfer } from '../container/crypto-asset/token/token-transfer';
import { TokenReceive } from '../container/crypto-asset/token/TokenReceive';
import { GasSetting } from '../container/crypto-asset/gas/gas-setting';
import { TokenManager } from '../container/crypto-asset/token/token-manager';
import { TokenPersist } from '../container/crypto-asset/token/token-persist';
import { TokenTransferConfirm } from '../container/crypto-asset/token/token-transfer-confirm';
import { UserProfile } from '../container/user/profile/Profile';
import { SingleInputScreen } from '../container/SingleInputScreen';
import { route } from './route.config';

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
    name: route.UserProfile,
    component: UserProfile,
  },
  {
    name: route.Auth,
    component: Auth,
  },
  {
    name: route.Setting,
    component: Setting,
  },
  {
    name: route.SingleInputScreen,
    component: SingleInputScreen,
  },
];
