/**
 * token
 */
import { Blockchain } from './Blockchain';

/**
 * Token
 */
export type Token = {
  /**
   * 币id
   */
  coinId: number;

  /**
   * 名称
   */
  name: string;

  /**
   * 代币符号
   */
  symbol: string;

  /**
   * 小数点
   */
  decimals: number;

  /**
   * 所属区块链
   */
  blockchain: Blockchain;
};

/**
 * Hierarchical Deterministic Token
 */
export type HDToken = Token & {
  /**
   * 派生路径
   * 最后一位为账户索引不填写
   * ETH: m/44'/60'/0'/0/address_index
   * m / purpose' / coin_type' / account' / change / address_index
   */
  derivePath: string;
};
