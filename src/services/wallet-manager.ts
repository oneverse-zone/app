import { action, makeAutoObservable, observable } from 'mobx';
import { Toast } from 'native-base';
import { Mnemonic, Wallet, WalletType } from '../entity/blockchain/wallet';
import { Coin } from '../entity/blockchain/coin';
import { WalletAccount } from '../entity/blockchain/wallet-account';
import { makePersistable } from 'mobx-persist-store';
import { makeResettable } from '../mobx/mobx-reset';
import { lang } from '../locales';
import { repository } from './Repository';
import { walletAdapter } from './blockchain/adapter';
import { coinService } from './blockchain/coin';
import { randomMnemonic } from '@oneverse/utils';
import { securityService } from './security';

/**
 * 钱包管理
 */
export class WalletManagerService {
  @observable
  loading = false;

  /**
   * DID身份钱包
   */
  @observable
  wallet: Wallet | undefined = undefined;

  /**
   * 钱包列表
   */
  @observable
  list: Array<Wallet> = [];

  /**
   * 当前选择的钱包下标
   */
  selectedIndex: number = 0;

  /**
   * 钱包索引
   */
  walletIndex = 1;

  constructor() {
    makeResettable(this);
    makeAutoObservable(this, undefined, {
      autoBind: true,
    });
    makePersistable(this, {
      name: 'WalletStore',
      properties: ['wallet', 'list', 'selectedIndex', 'walletIndex'],
    }).finally(() => {
      // 更新钱余额信息
      // this.updateSelectWalletBalance();
    });
  }

  /**
   * 返回所有钱包
   */
  get wallets(): Array<Wallet> {
    const wallets = [];
    if (this.wallet) {
      wallets.push(this.wallet);
    }
    wallets.push(...this.list);
    return wallets;
  }

  /**
   * 当前选择的钱包
   */
  get selected(): Wallet | null {
    return this.wallets[this.selectedIndex];
  }

  @action
  selectWallet(index: number) {
    if (!this.wallets[index]) {
      return;
    }
    this.selectedIndex = index;
    // this.updateSelectWalletBalance();
  }

  /**
   * 初始化DID HD钱包
   * @param name 钱包名称
   */
  @action
  async initDIDHDWallet(name: string) {
    if (this.loading) {
      return;
    }
    this.loading = true;
    console.log('创建DID HD钱包');
    try {
      const mnemonicCiphertext: any = await repository.findMnemonic();
      if (null == mnemonicCiphertext) {
        console.log('无效的助记词');
        return;
      }
      const mnemonic: Mnemonic = await securityService.decrypt<Mnemonic>(mnemonicCiphertext);
      const wallet = await this.handleCreateWallet(name, coinService.systemCoins, mnemonic);
      wallet.index = 0;
      this.walletIndex -= 1;
    } catch (e: any) {
      console.log(`身份钱包创建失败: ${e.message}`, e);
      throw e;
    } finally {
      this.loading = false;
    }
  }

  /**
   * 创建钱包
   * @param name 名称
   * @param mnemonicLength 助记词长度
   * @param mnemonicPassword 助记词密码
   */
  async createHDWallet(name: string, mnemonicLength: 12 | 24, mnemonicPassword?: string) {
    if (this.loading) {
      return;
    }
    this.loading = true;
    try {
      const mnemonic = randomMnemonic(mnemonicLength === 12 ? 16 : 32);
      const wallet = await this.handleCreateWallet(name, coinService.systemCoins, {
        mnemonic,
        password: mnemonicPassword,
      });
      this.list.push(wallet);
    } catch (e: any) {
      Toast.show({
        title: lang('wallet.exist'),
      });
      throw e;
    } finally {
      this.loading = false;
    }
  }

  /**
   * 导入HD钱包
   * @param name 钱包名称
   * @param mnemonic 助记词
   * @param password 助记词密码
   */
  async importHDWallet(name: string, mnemonic: string, password?: string) {
    if (this.loading) {
      return;
    }
    this.loading = true;
    try {
      const wallet = await this.handleCreateWallet(name, coinService.systemCoins, { mnemonic, password: password });
      this.list.push(wallet);
    } finally {
      this.loading = false;
    }
  }

  /**
   * 导入单链钱包
   * @param name 钱包名称
   * @param secretKey 秘钥
   */
  async importSingleChainWallet(name: string, secretKey: string) {
    if (this.loading) {
      return;
    }
    this.loading = true;
    try {
      const wallet = await this.handleCreateWallet(name, coinService.systemCoins, secretKey);
      this.list.push(wallet);
    } finally {
      this.loading = false;
    }
  }

  /**
   * 派生HD钱包
   * @param walletIndex
   * @param coin
   * @param addressIndex 地址索引
   */
  @action
  async createAccount(walletIndex: number, coin: Coin, addressIndex: number) {
    if (this.loading) {
      return;
    }
    const wallet = this.wallets[walletIndex];
    if (wallet.type === WalletType.SINGLE_CHAIN) {
      console.log(`助记词钱包不支持派生子钱包`);
      return;
    }

    this.loading = true;
    try {
      const walletAccount = walletAdapter.createAccount({
        name: `Account ${addressIndex}`,
        coin,
        accountIndex: 0,
        changeIndex: 0,
        addressIndex: 0,

        mnemonic: '',
        password: '',
      });
      const exists = wallet.accounts.findIndex(item => (item.address = walletAccount.address)) > -1;
      if (exists) {
        throw new Error('账户已经存在');
      }
      wallet.accounts.push(walletAccount);
      this.wallets[walletIndex] = wallet;
    } finally {
      this.loading = false;
    }
  }

  /**
   * HD钱包创建
   * @param name 钱包名称
   * @param coins 初始化币种信息
   * @param secretKey 助记词信息 或者 私钥
   */
  private async handleCreateWallet(name: string, coins: Array<Coin>, secretKey: Mnemonic | string): Promise<Wallet> {
    const secretKeyCiphertext = await securityService.encrypt(secretKey);

    let walletOption,
      options = {};
    // 创建私钥钱包
    if (typeof secretKey === 'string') {
      walletOption = {
        type: WalletType.SINGLE_CHAIN,
      };
      options = {
        secretKey,
      };
    } else {
      walletOption = {
        type: WalletType.HD,
      };
      options = {
        mnemonic: secretKey.mnemonic,
        password: secretKey.password,
      };
    }

    const walletAccounts: Array<WalletAccount> = coins.map(coin => {
      return walletAdapter.createAccount({
        name: `Account 0`,
        coin,
        accountIndex: 0,
        changeIndex: 0,
        addressIndex: 0,

        ...(options as any),
      });
    });
    const wallet: Wallet = {
      index: this.walletIndex,
      name,
      accounts: walletAccounts,
      secretKey: secretKeyCiphertext,
      ...(walletOption as any),
    };
    this.walletIndex += 1;
    console.log(`创建HD钱包成功: ${wallet.index} ${wallet.name}`);
    return wallet;
  }
}

export const walletManagerService = new WalletManagerService();
