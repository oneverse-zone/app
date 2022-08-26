import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import { makeResettable } from '../../mobx/mobx-reset';
import { AccountToken, WalletAccount } from '../../entity/blockchain/wallet-account';
import { COIN_TOKEN_CONTRACT_ADDRESS, Token, TokenType } from '../../entity/blockchain/token';
import { walletAdapter } from './adapter';
import { coinService } from './coin';
import { walletManagerService } from './wallet-manager';
import { BaseToken, Coin } from '../../entity/blockchain/coin';
import { accountAdapter } from './account-adapter';
import { Toast } from 'native-base';
import { lang } from '../../locales';
import { goBack } from '../../core/navigation';

/**
 * token 服务
 */
export class TokenService {
  loading = false;

  // /**
  //  * 账户对应的token信息
  //  */
  // tokens: Record<string, AccountToken[]> = {};

  constructor() {
    makeResettable(this);
    makeAutoObservable(this, undefined, {
      autoBind: true,
    });
    makePersistable(this, {
      name: 'TokenStore',
      properties: [],
    }).finally(() => {
      console.log(`加载本地token完成`);
    });
  }

  /**
   * 获取当前选择的钱包，对应链、对应账户的token列表
   */
  get selectTokens(): AccountToken[] {
    const account = walletManagerService.selectedAccount;
    if (!account) {
      return [];
    }
    return account.tokens;
  }

  /**
   * 获取当前账户的主链币Token信息所在的索引
   */
  get selectedMainTokenIndex(): number {
    return this.selectTokens.findIndex(item => item.type === TokenType.COIN);
  }

  /**
   * 当前账户对应的主链币Token信息
   */
  get selectedMainToken(): AccountToken | undefined {
    return this.selectTokens.find(item => item.type === TokenType.COIN);
  }

  /**
   * 当前账户对应的主链币信息
   */
  get selectedAccountCoin(): Coin | undefined {
    const account = walletManagerService.selectedAccount;
    if (!account) {
      return undefined;
    }
    return coinService.findByBlockchainId(account.blockchainId);
  }

  /**
   * 更新当前选择账户中的token信息
   */
  async updateSelectAccountToken() {
    const account = walletManagerService.selectedAccount;
    account && (await this.updateAccountToken(account));
  }

  /**
   * 更新账户中的token信息
   */
  async updateAccountToken(account: WalletAccount) {
    const tasks = this.getTokens(account).map(async item => {
      item.balance = await this.handleQueryBalance(account, item);
      console.log(`查询余额: ${account.address} Token=${(item.token as Token).address} balance=${item.balance}`);
      return item;
    });
    account.tokens = await Promise.all(tasks);
  }

  async add(type: TokenType, address: string, baseToken: BaseToken) {
    if (this.loading) {
      return;
    }
    this.loading = true;
    try {
      const exists = this.selectTokens.findIndex(item => item.token.address === address) > -1;
      if (exists) {
        Toast.show({
          title: lang('token.exists'),
        });
        return;
      }

      const coin = this.selectedAccountCoin;
      if (!coin) {
        return;
      }

      const token: Token = {
        ...baseToken,
        type,
        address,
        blockchainId: coin.blockchainId,
      };

      const accountToken: AccountToken = {
        type,
        balance: 0,
        token,
      };

      walletManagerService.selectedAccount?.tokens.push(accountToken);
      await this.updateSelectAccountToken();
      goBack();
    } finally {
      this.loading = false;
    }
  }

  async getTokenInfo(address: string): Promise<BaseToken | undefined> {
    if (this.loading) {
      return undefined;
    }
    this.loading = true;
    try {
      const baseToken = await accountAdapter().getTokenInfo(address);
      if (baseToken) {
        console.log(baseToken);
        return baseToken;
      } else {
        Toast.show({
          title: lang('contract.address.invalid'),
        });
      }
    } finally {
      this.loading = false;
    }
  }

  /**
   * 获取账户的所有token 信息
   * @param account
   */
  private getTokens(account: WalletAccount) {
    const tokens: Array<AccountToken> = [];
    const coin = coinService.findByBlockchainId(account.blockchainId);
    if (null == coin) {
      return tokens;
    }
    tokens.push({
      token: {
        ...coin,
        type: TokenType.COIN,
        address: COIN_TOKEN_CONTRACT_ADDRESS,
      },
      balance: 0,
      type: TokenType.COIN,
    });
    account.tokens.forEach(item => {
      if (item.type === TokenType.COIN) {
        return;
      }
      tokens.push({
        token: item.token,
        balance: 0,
        type: item.type,
      });
    });
    return tokens;
  }

  private handleQueryBalance(account: WalletAccount, token: AccountToken): Promise<string> {
    return walletAdapter.getAccountProvider(account).getBalanceUI(account, token.token);
  }
}

export const tokenService = new TokenService();
