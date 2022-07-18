/**
 * Token
 */
import { Blockchain } from './Blockchain';

export enum TokenType {
  COIN = 'COIN',
  ERC20 = 'ERC20',
}

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
   * token类型
   */
  type: TokenType;

  /**
   * 合约地址
   * 如果是公链币，使用0x0000000...
   */
  contractAddress: string;

  /**
   * 代币符号
   */
  symbol: string;

  /**
   * 小数点
   */
  decimals: number;

  /**
   * token logo 地址
   */
  logo: any;

  blockchain: Blockchain;
};

// /**
//  * Hierarchical Deterministic Token
//  */
// export type HDToken = Token & {
//   /**
//    * 派生路径
//    * 最后一位为账户索引不填写
//    * ETH: m/44'/60'/0'/0/address_index
//    * m / purpose' / coin_type' / account' / change / address_index
//    */
//   derivePath: string;
// };
