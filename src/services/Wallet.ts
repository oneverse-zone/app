import { action, makeAutoObservable, observable } from 'mobx';
import { Wallet as BlockchainWallet } from '@ethersproject/wallet';
import { HDNode } from '@ethersproject/hdnode';
import { formatUnits, parseEther } from '@ethersproject/units';
import { TransactionRequest } from '@ethersproject/abstract-provider';
import { randomString } from '@stablelib/random';
import { Decimal } from 'decimal.js';
import { tokens } from '../constants/Token';
import { Wallet, WalletToken, WalletType } from '../entity/Wallet';
import { Token } from '../entity/Token';
import { makePersistable } from 'mobx-persist-store';
import { Toast } from 'native-base';
import { lang } from '../locales';
import { blockchainNodeService } from './BlockchainNode';
import { repository } from './Repository';

/**
 * 钱包服务
 */
export class WalletService {
  @observable
  loading = false;

  /**
   * 身份钱包
   */
  @observable
  wallet: Wallet | null = null;

  /**
   * 单链钱包
   */
  @observable
  list: Array<Wallet> = [];

  /**
   * 当前选择的钱包下标
   */
  selectedIndex: number = 0;

  constructor() {
    makeAutoObservable(this, undefined, {
      autoBind: true,
    });
    makePersistable(this, {
      name: 'WalletStore',
      properties: ['wallet', 'list', 'selectedIndex'],
    }).finally(() => {
      // 更新钱余额信息
      this.updateSelectWallet();
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

  /**
   * 当前选择钱包的总余额
   */
  get totalAmount(): number {
    if (!this.selected) {
      return 0;
    }
    return this.selected.tokens
      .reduce((previousValue, currentValue) => {
        return previousValue.add(new Decimal(currentValue.balance || 0));
      }, new Decimal(0))
      .toNumber();
  }

  /**
   * 初始化HD钱包
   */
  @action
  async initHDWallet(mnemonic: string, password?: string) {
    if (this.wallet) {
      console.log('钱包已经存在');
      return;
    }
    console.log('创建身份钱包');
    try {
      this.wallet = {
        index: 0,
        name: 'HD',
        type: WalletType.HD,
        tokens: tokens.map(token => {
          const derivePath = `m/44'/${token.coinId}'/0'/0/0`;
          const tmp = new BlockchainWallet(HDNode.fromMnemonic(mnemonic, password).derivePath(derivePath));
          console.log('tmp', tmp);
          const walletToken: WalletToken = {
            ...token,
            address: tmp.address,
            balance: 0,
            derivePath,
          };
          return walletToken;
        }),
      };
    } catch (e: any) {
      console.log(`身份钱包创建失败: ${e.message}`, e);
      throw e;
    }
  }

  /**
   * 钱包创建
   */
  @action
  async create(mnemonic: string, token: Token, password?: string) {
    if (this.loading) {
      return;
    }
    this.loading = false;
    try {
      // m/44'/60'/0'/0/address_index
      const derivePath = `m/44'/${token.coinId}/0'/0/0`;
      const tmp = new BlockchainWallet(HDNode.fromMnemonic(mnemonic, password).derivePath(derivePath));
      const idx = this.list.findIndex(item => item.tokens.findIndex(t => t.address === tmp.address) > -1);
      if (idx > -1) {
        Toast.show({
          title: lang('wallet.exist'),
        });
        return;
      }
      // 最后一次创建的同链钱包
      const last = this.list.find(item => item.tokens.findIndex(t => t.contractAddress === token.contractAddress) > -1);
      let index = last ? last.index + 1 : 0;
      const wallet: Wallet = {
        index: index,
        name: `${token.name}-${index + 1}`,
        type: WalletType.SINGLE_CHAIN,
        tokens: [
          {
            ...token,
            address: tmp.address,
            balance: 0,
            derivePath,
          },
        ],
      };
      this.list = [...this.list, wallet];
    } finally {
      this.loading = false;
    }
  }

  /**
   * 更新选择钱包的信息
   */
  async updateSelectWallet() {
    if (!this.wallet) {
      return;
    }
    console.log(`更新钱包余额 ${this.wallet.name}`);
    this.wallet.tokens = await Promise.all(
      this.wallet.tokens.map(token =>
        (async () => {
          token.balance = (await this.getBalance(token)) || 0;
          return token;
        })(),
      ),
    );
  }

  /**
   * 发送一个交易
   * @param fromToken 发送token信息
   * @param toAddress 接受token地址
   * @param value 值
   */
  async sendTransaction(fromToken: WalletToken, toAddress: string, value: string | number) {
    const { mnemonic, password }: any = (await repository.findMnemonic(true)) || {};
    if (!mnemonic) {
      console.error('用户助记词不存在');
      return;
    }

    const provider = blockchainNodeService.getEthereumProvider();
    const wallet = new BlockchainWallet(
      HDNode.fromMnemonic(mnemonic, password).derivePath(fromToken.derivePath),
      provider,
    );
    const tx: TransactionRequest = {
      to: toAddress,
      value: parseEther(`${value}`),
      nonce: randomString(32),
    };
    console.log(`TransactionRequest: ${tx}`);
    // const txHash = await wallet.signTransaction(tx);
    const txRes = await wallet.sendTransaction(tx);
    console.log(txRes);
  }

  /**
   * 获取余额
   * @param address
   */
  async getBalance({ address }: WalletToken) {
    try {
      const provider = blockchainNodeService.getEthereumProvider();
      const balanceWei = await provider.getBalance(address);
      const balanceEthr = formatUnits(balanceWei);
      console.log(`${address} Balance: ${balanceEthr}=${balanceWei}`);

      return balanceEthr;
    } catch (e: any) {
      console.log(`余额查询失败: ${e.message}`);
    }
  }
}

export const walletService = new WalletService();
