/**
 * 助记词
 */
import { WalletAccount } from './wallet-account';

export type Mnemonic = {
  mnemonic: string;
  password?: string;
};

/**
 * 钱包类型
 */
export enum WalletType {
  /**
   * 单链钱包
   */
  SINGLE_CHAIN,
  /**
   * Hierarchical Deterministic (HD) Wallets
   */
  HD,
}

/**
 * OneVerse 钱包实体定义
 */
export type Wallet = {
  /**
   * 钱包ID
   */
  id: string;

  /**
   * 钱包名称
   */
  name: string;

  /**
   * 钱包类型
   */
  type: WalletType;

  /**
   * 加密后的助记词或者私钥
   */
  secretKey: string;

  /**
   * 账户信息
   */
  accounts: Array<WalletAccount>;
};
