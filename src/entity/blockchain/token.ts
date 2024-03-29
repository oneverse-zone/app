import { Coin } from './coin';

export enum TokenType {
  COIN = 'COIN',
  ERC20 = 'ERC20',
  ERC721 = 'ERC721',
  ERC1155 = 'ERC1155',
}

/**
 * 主链币合约地址
 */
export const COIN_TOKEN_CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';

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
  address?: string;

  /**
   * 描述
   */
  describe?: string;
  /**
   * 官方网站
   */
  officialSite: string;
} & Omit<Coin, 'id'>;
