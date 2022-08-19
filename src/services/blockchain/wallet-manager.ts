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
import { blockchainService } from './index';

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
   * 当前选择的帐户ID
   */
  selectedAccountId: string = '';

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
      properties: ['wallet', 'list', 'selectedIndex', 'selectedAccountId', 'walletIndex'],
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
  get selectedAccounts(): Array<WalletAccount> {
    return this.selected?.accounts ?? [];
  }

  /**
   * 当前选择的钱包对应选择链的帐户列表
   */
  get selectedAccountsOnSelectChain() {
    const accounts = this.selectedAccounts;
    const blockchain = blockchainService.selected;
    if (!blockchain) {
      return accounts;
    }
    return accounts.filter(item => item.blockchainId === blockchain.id);
  }

  /**
   * 当前选择的帐户
   */
  get selectedAccount(): WalletAccount | undefined {
    return this.selectedAccounts.find(item => item.id === this.selectedAccountId);
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
    this.selectAccount(this.selectedAccountsOnSelectChain[0]?.id ?? '');
  }

  /**
   * 选择账户
   * @param id 账户ID
   */
  selectAccount(id: string) {
    const idx = this.selectedAccounts.findIndex(item => item.id === id);
    if (idx > -1) {
      this.selectedAccountId = id;
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

  async createAccount(wallet: Wallet, coin: Coin, name: string, addressIndex: number) {
    if (this.loading) {
      return;
    }
    this.loading = true;
    try {
      const account = await this.executeCreateAccount(wallet, coin, name, addressIndex);
      wallet.accounts.push(account);
    } finally {
      this.loading = false;
    }
  }

  /**
   * 执行钱包创建
   * @param name
   * @param coins
   * @param secretKey
   * @private
   */
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
    const accounts = [];
    for (const item of coins) {
      accounts.push(await this.executeCreateAccount(wallet, item, 'Account 0', 0));
    }
    wallet.accounts = accounts;
    console.log(`创建HD钱包成功: ${wallet.id} ${wallet.name}`);
    return wallet;
  }

  /**
   * 派生HD钱包
   * @param wallet
   * @param coin
   * @param name 账户名称
   * @param addressIndex 地址索引
   */
  private async executeCreateAccount(
    wallet: Wallet,
    coin: Coin,
    name: string,
    addressIndex: number,
  ): Promise<WalletAccount> {
    if (wallet.type === WalletType.SINGLE_CHAIN) {
      console.log(`助记词钱包不支持派生子钱包`);
      throw new Error(`助记词钱包不支持派生子钱包`);
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

    const account = walletAdapter.createAccount({
      name,
      coin,
      ...(options as any),
    });
    const exists = accounts.findIndex(i => i.address === account.address) > -1;
    if (exists) {
      throw new Error(`钱包已经存在`);
    }
    account.walletId = wallet.id;
    account.id = nanoid();
    return account;
  }
}

export const walletManagerService = new WalletManagerService();
