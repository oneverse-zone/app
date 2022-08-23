import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import { makeResettable } from '../../mobx/mobx-reset';
import { AccountToken, FullToken, WalletAccount } from '../../entity/blockchain/wallet-account';
import { COIN_TOKEN_CONTRACT_ADDRESS, TokenType } from '../../entity/blockchain/token';
import { walletAdapter } from './adapter';
import { coinService } from './coin';
import { walletManagerService } from './wallet-manager';
import { accountAdapter } from './account-adapter';

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
      console.log(`加载本地token完成`);
    });
  }

  /**
   * 获取当前选择的钱包，对应链、对应账户的token列表
   */
  get selectTokens(): FullToken[] {
    const account = walletManagerService.selectedAccount;
    if (!account) {
      return [];
    }
    return this.tokens[account.id] ?? [];
  }

  /**
   * 获取当前账户的主链币Token信息
   */
  get selectedMainTokenIndex(): number {
    return this.selectTokens.findIndex(item => item.type === TokenType.COIN);
  }

  /**
   * 更新当前选择账户中的token信息
   */
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
    this.tokens[account.id] = await Promise.all(tasks);
  }

  /**
   * 获取账户的所有token 信息
   * @param account
   */
  private getTokens(account: WalletAccount) {
    const tokens: Array<FullToken> = [];
    const coin = coinService.findByBlockchainId(account.blockchainId);
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
    return walletAdapter.getAccountProvider(account).getBalanceUI(account, token);
  }
}

export const tokenService = new TokenService();
