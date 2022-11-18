import {AccountToken, WalletAccount} from '../../entity/blockchain/wallet-account';
import {Token, TokenType} from '../../entity/blockchain/token';
import {walletAdapter} from './adapter';
import {coinService} from './coin';
import {walletManagerService} from './wallet-manager';
import {BaseToken, Coin} from '../../entity/blockchain/coin';
import {accountAdapter} from './account-adapter';
import {Toast} from 'native-base';
import {lang} from '../../locales';
import {goBack} from '../../core/navigation';
import {makeMobxState} from '../../mobx/mobx-manager';
import {observe} from 'mobx';

/**
 * token 服务
 */
export class TokenService {
  loading = false;

  updateTokenLoading = false;

  constructor() {
    makeMobxState(this, {
      storageOptions: {
        name: 'TokenStore',
        properties: [],
      },
    });
    observe(walletManagerService, (change: any) => {
      if ('selectedAccountId' === change.name) {
        console.log(`钱包 ${change.name.toString()} 变更刷新token old: ${change.oldValue} new: ${change.newValue}`);
        this.updateSelectAccountToken();
      }
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
    return this.selectTokens.findIndex(item => item.token.type === TokenType.COIN);
  }

  /**
   * 当前账户对应的主链币Token信息
   */
  get selectedMainToken(): AccountToken | undefined {
    return this.selectTokens.find(item => item.token.type === TokenType.COIN);
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
    if (this.updateTokenLoading) {
      return;
    }
    this.updateTokenLoading = true;
    try {
      const account = walletManagerService.selectedAccount;
      account && (await this.updateAccountToken(account));
    } finally {
      this.updateTokenLoading = false;
    }
  }

  /**
   * 更新账户中的token信息
   */
  async updateAccountToken(account: WalletAccount) {
    const tasks = account.tokens.map(async item => {
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

  private handleQueryBalance(account: WalletAccount, token: AccountToken): Promise<string> {
    return walletAdapter.getAccountProvider(account).getBalanceUI(account, token.token);
  }
}

export const tokenService = new TokenService();
