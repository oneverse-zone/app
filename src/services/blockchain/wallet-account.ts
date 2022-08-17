import { makeResettable } from '../../mobx/mobx-reset';
import { action, makeAutoObservable } from 'mobx';
import { WalletAccount } from '../../entity/blockchain/wallet-account';
import { Coin } from '../../entity/blockchain/coin';
import { Mnemonic, Wallet, WalletType } from '../../entity/blockchain/wallet';
import { walletAdapter } from './adapter';
import { securityService } from '../security';
import { makePersistable } from 'mobx-persist-store';
import { walletManagerService } from './wallet-manager';

/**
 * 钱包账户服务
 */
export class WalletAccountService {
  loading = false;

  /**
   * 钱包对应的账户信息
   */
  accounts: Record<number, WalletAccount[]> = {};

  /**
   * 当前选择的帐户
   */
  selectIndex = -1;

  constructor() {
    makeResettable(this);
    makeAutoObservable(this, undefined, {
      autoBind: true,
    });
    makePersistable(this, {
      name: 'WalletAccountStore',
      properties: ['accounts', 'selectIndex'],
    }).finally(() => {
      this.updateSelectWalletBalance();
    });
  }

  /**
   * 选择账户
   * @param index 账户索引, 小于则认为是选择所有
   */
  switchAccount(index: number) {
    if (index < 0) {
      this.selectIndex = -1;
      this.updateSelectWalletBalance();
      return;
    }
    const wallet = walletManagerService.selected;
    if (!wallet) {
      return;
    }
    if (this.accounts[wallet.index]?.[index]) {
      this.selectIndex = index;
      this.updateSelectWalletBalance();
    }
  }

  /**
   * 当前选择钱包的帐户信息
   */
  get walletAccounts() {
    const wallet = walletManagerService.selected;
    if (!wallet) {
      return [];
    }
    return this.accounts[wallet.index] ?? [];
  }

  /**
   * 派生HD钱包
   * @param wallet
   * @param coin
   * @param addressIndex 地址索引
   */
  @action
  async createAccount(wallet: Wallet, coin: Coin | Coin[], addressIndex?: number) {
    if (this.loading) {
      return;
    }
    if (wallet.type === WalletType.SINGLE_CHAIN) {
      console.log(`助记词钱包不支持派生子钱包`);
      return;
    }

    this.loading = true;
    try {
      const secretKey = await securityService.decrypt<Mnemonic | string>(wallet.secretKey);
      let options = {};
      if (typeof secretKey === 'string') {
        options = {
          secretKey,
        };
      } else {
        options = {
          accountIndex: 0,
          changeIndex: 0,
          addressIndex,
          ...secretKey,
        };
      }

      const accounts = this.accounts[wallet.index] ?? [];

      const walletAccounts = (Array.isArray(coin) ? coin : [coin]).map(item => {
        const acc = walletAdapter.createAccount({
          name: `Account ${addressIndex}`,
          coin: item,
          ...(options as any),
        });
        const exists = accounts.findIndex(i => i.address === acc.address) > -1;
        if (exists) {
          throw new Error(`钱包已经存在`);
        }
        return acc;
      });

      accounts.push(...walletAccounts);
      this.accounts[wallet.index] = accounts;
      this.updateSelectWalletBalance();
    } finally {
      this.loading = false;
    }
  }

  updateSelectWalletBalance() {}
}

export const walletAccountService = new WalletAccountService();
