import { action, makeAutoObservable, observable } from 'mobx';
import { Toast } from 'native-base';
import { nanoid } from 'nanoid';
import { Mnemonic, Wallet, WalletType } from '../../entity/blockchain/wallet';
import { Coin } from '../../entity/blockchain/coin';
import { makePersistable } from 'mobx-persist-store';
import { makeResettable } from '../../mobx/mobx-reset';
import { lang } from '../../locales';
import { repository } from '../Repository';
import { walletAdapter } from './adapter';
import { coinService } from './coin';
import { randomMnemonic } from '@oneverse/utils';
import { securityService } from '../security';
import { tokenService } from './token';
import { WalletAccount } from '../../entity/blockchain/wallet-account';

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
   * 当前选择的帐户下表
   */
  selectedAccountIndex: number = 0;

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
      properties: ['wallet', 'list', 'selectedIndex', 'selectedAccountIndex', 'walletIndex'],
    }).finally(() => {});
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

  /**
   * 当前选择的钱包对应的帐户列表
   */
  get selectWalletAccounts(): Array<WalletAccount> {
    return this.selected?.accounts ?? [];
  }

  /**
   * 当前选择的帐户
   */
  get selectedAccount(): WalletAccount | undefined {
    return this.selectWalletAccounts[this.selectedAccountIndex];
  }

  /**
   * 选择钱包
   * @param index 钱包索引
   */
  @action
  selectWallet(index: number) {
    if (!this.wallets[index]) {
      return;
    }
    this.selectedIndex = index;
    this.selectWalletAccount(0);
  }

  /**
   * 选择账户
   * @param index 账户索引
   */
  selectWalletAccount(index: number) {
    if (this.selected?.accounts[index]) {
      this.selectedAccountIndex = index;
      tokenService.updateSelectAccountToken();
    }
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
      const mnemonic = await securityService.decrypt<Mnemonic>(mnemonicCiphertext);
      if (null == mnemonic) {
        console.log(`身份助记词解密失败`);
        return;
      }
      this.wallet = await this.handleCreateWallet(name, coinService.systemCoins, mnemonic);
      this.selectWallet(0);
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
      await this.executeCreateWallet(name, coinService.systemCoins, {
        mnemonic,
        password: mnemonicPassword,
      });
      return mnemonic;
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
      await this.executeCreateWallet(name, coinService.systemCoins, { mnemonic, password: password });
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
      await this.executeCreateWallet(name, coinService.systemCoins, secretKey);
    } finally {
      this.loading = false;
    }
  }

  private async executeCreateWallet(name: string, coins: Array<Coin>, secretKey: Mnemonic | string) {
    const wallet = await this.handleCreateWallet(name, coins, secretKey);
    this.list.push(wallet);
    this.selectWallet(this.list.length - 1);
  }

  /**
   * HD钱包创建
   * @param name 钱包名称
   * @param coins 初始化币种信息
   * @param secretKey 助记词信息 或者 私钥
   */
  private async handleCreateWallet(name: string, coins: Array<Coin>, secretKey: Mnemonic | string): Promise<Wallet> {
    const secretKeyCiphertext = await securityService.encrypt(secretKey);

    let walletOption;
    // 创建私钥钱包
    if (typeof secretKey === 'string') {
      walletOption = {
        type: WalletType.SINGLE_CHAIN,
      };
    } else {
      walletOption = {
        type: WalletType.HD,
      };
    }

    const wallet: Wallet = {
      id: nanoid(),
      name,
      secretKey: secretKeyCiphertext,
      accounts: [],
      ...(walletOption as any),
    };
    this.walletIndex += 1;
    await this.createAccount(wallet, coins, 0);
    console.log(`创建HD钱包成功: ${wallet.id} ${wallet.name}`);
    return wallet;
  }

  /**
   * 派生HD钱包
   * @param wallet
   * @param coin
   * @param addressIndex 地址索引
   */
  @action
  async createAccount(wallet: Wallet, coin: Coin | Coin[], addressIndex?: number) {
    if (wallet.type === WalletType.SINGLE_CHAIN) {
      console.log(`助记词钱包不支持派生子钱包`);
      return;
    }

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

    const accounts = wallet.accounts;

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
      acc.walletId = wallet.id;
      acc.id = nanoid();
      return acc;
    });

    accounts.push(...walletAccounts);
    wallet.accounts = accounts;
  }
}

export const walletManagerService = new WalletManagerService();
