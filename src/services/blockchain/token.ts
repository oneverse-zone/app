import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import { makeResettable } from '../../mobx/mobx-reset';
import { AccountToken, FullToken, WalletAccount } from '../../entity/blockchain/wallet-account';
import { COIN_TOKEN_CONTRACT_ADDRESS, TokenType } from '../../entity/blockchain/token';
import { walletAdapter } from './adapter';
import { coinService } from './coin';
import { walletManagerService } from './wallet-manager';

/**
 * token 服务
 */
export class TokenService {
  /**
   * 账户对应的token信息
   */
  tokens: Record<string, FullToken[]> = {};

  constructor() {
    makeResettable(this);
    makeAutoObservable(this, undefined, {
      autoBind: true,
    });
    makePersistable(this, {
      name: 'TokenStore',
      properties: ['tokens'],
    }).finally(() => {
      console.log(`加载token完成`);
    });
  }

  updateSelectAccountToken() {
    const account = walletManagerService.selectedAccount;
    account && this.updateAccountToken(account);
  }

  /**
   * 更新账户中的token信息
   */
  async updateAccountToken(account: WalletAccount) {
    const tasks = this.getTokens(account).map(async item => {
      item.balance = await this.handleQueryBalance(account, item);
      return item;
    });
    const values = await Promise.all(tasks);
    console.log(values);
    this.tokens[account.id] = values;
  }

  /**
   * 获取账户的所有token 信息
   * @param account
   */
  getTokens(account: WalletAccount) {
    const tokens: Array<FullToken> = [];
    const coin = coinService.findById(account.coinId);
    if (null == coin) {
      return tokens;
    }
    tokens.push({
      ...coin,
      address: COIN_TOKEN_CONTRACT_ADDRESS,
      balance: 0,
      type: TokenType.COIN,
    });
    account.tokens.forEach(item => {
      tokens.push({
        ...coin,
        address: item.address,
        balance: 0,
        type: item.type,
      });
    });
    return tokens;
  }

  private handleQueryBalance(account: WalletAccount, token: AccountToken): Promise<string> {
    console.log(`查询余额: ${account.address} Token=${token.address}`);
    return walletAdapter.getBalance(account, token);
  }
}

export const tokenService = new TokenService();