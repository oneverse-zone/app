import { Coin } from './coin';

export enum TokenType {
  ERC20 = 'ERC20',
  ERC721 = 'ERC721',
}

/**
 * Token
 */
export type Token = {
  /**
   * token类型
   */
  type: TokenType;

  /**
   * 合约地址
   * 如果是公链币，使用0x0000000...
   */
  address: string;
} & Coin;
