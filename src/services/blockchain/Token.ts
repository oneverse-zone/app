import { makeAutoObservable } from 'mobx';
import { btcToken, ethToken, maticToken } from '../../constants/Token';
import { Token, TokenType } from '../../entity/Token';
import { makePersistable } from 'mobx-persist-store';
import { blockchainService } from './index';
import { Blockchain } from '../../entity/Blockchain';
import { makeResettable } from '../../mobx/mobx-reset';

const tokens: Array<Token> = [btcToken, ethToken, maticToken];

/**
 * token 服务
 */
export class TokenService {
  /**
   * 公链token 列表
   */
  publicTokens: Array<Token> = tokens;

  /**
   * 用户自定义token
   */
  customTokens: Array<Token> = [];

  constructor() {
    makeResettable(this);
    makeAutoObservable(this, undefined, {
      autoBind: true,
    });
    makePersistable(this, {
      name: 'TokenStore',
      properties: ['customTokens'],
    });
  }

  /**
   * 所有token列表
   */
  get tokens() {
    return [...this.publicTokens, ...this.customTokens];
  }

  /**
   * 支持HD的token列表
   */
  get hdTokens() {
    return this.publicTokens.filter(item => blockchainService.supportHD(item.blockchain.id));
  }

  /**
   * 查找主链币
   * @param blockchain 币种ID
   */
  findCoin(blockchain: Blockchain): Token | undefined {
    return this.publicTokens.find(item => item.blockchain.id === blockchain.id && item.type === TokenType.COIN);
  }

  /**
   * 查找token
   * @param coinId 币id
   * @param contractAddress 合约地址
   */
  findToken(coinId: number, contractAddress: string): Token | undefined {
    return this.tokens.find(item => item.coinId === coinId && item.contractAddress === contractAddress);
  }
}

export const tokenService = new TokenService();
