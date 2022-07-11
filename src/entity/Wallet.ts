import { Token } from './Token';

/**
 * 钱包内的token信息
 */
export type WalletToken = {
  /**
   * 资产类型
   */
  address: string;

  /**
   * 余额
   */
  balance: number;

  /**
   * token 定义信息
   */
  token: Token;

  /**
   * HD 钱包分隔符
   */
  derivePath: string;
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
   * hd: 身份钱包
   * default 单链钱包
   */
  type: 'hd' | 'default';
  /**
   * 钱包内token列表
   */
  tokens: Array<WalletToken>;
};
