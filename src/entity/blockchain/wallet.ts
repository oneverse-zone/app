import { WalletAccount } from './wallet-account';

/**
 * 助记词
 */
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
 * HD 钱包信息
 */
export type HDWallet = {
  type: WalletType.HD;
  /**
   * 助记词
   */
  mnemonic: Mnemonic;
};

/**
 * 单链钱包
 */
export type SignChainWallet = {
  type: WalletType.SINGLE_CHAIN;
  mnemonic?: never;
};

/**
 * OneVerse 钱包实体定义
 */
export type Wallet = {
  /**
   * 钱包索引
   */
  index: number;

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
} & (HDWallet | SignChainWallet);
