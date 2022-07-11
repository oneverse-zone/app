import { action, makeAutoObservable, observable } from 'mobx';
import { Wallet as BlockchainWallet } from '@ethersproject/wallet';
import { HDNode } from '@ethersproject/hdnode';
import { tokens } from '../constants/Token';
import { Wallet, WalletToken } from '../entity/Wallet';
import { Token } from '../entity/Token';
import { makePersistable } from 'mobx-persist-store';
import { Toast } from 'native-base';
import { lang } from '../locales';

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
   * 查询本地钱包列表
   */
  async query() {}

  /**
   * 初始化HD钱包
   */
  @action
  async initHDWallet(mnemonic: string, password?: string) {
    if (this.wallet) {
      console.info('钱包已经存在');
      return;
    }
    this.wallet = {
      index: 0,
      name: 'HD',
      type: 'hd',
      tokens: tokens.map(token => {
        const derivePath = `m/44'/${token.coinId}/0'/0/0`;
        const tmp = new BlockchainWallet(HDNode.fromMnemonic(mnemonic, password).derivePath(derivePath));
        const walletToken: WalletToken = {
          address: tmp.address,
          balance: 0,
          token,
          derivePath,
        };
        return walletToken;
      }),
    };
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
      const last = this.list.find(
        item => item.tokens.findIndex(t => t.token.contractAddress === token.contractAddress) > -1,
      );
      let index = last ? last.index + 1 : 0;
      const wallet: Wallet = {
        index: index,
        name: `${token.name}-${index + 1}`,
        type: 'default',
        tokens: [
          {
            address: tmp.address,
            balance: 0,
            token,
            derivePath,
          },
        ],
      };
      this.list = [...this.list, wallet];
    } finally {
      this.loading = false;
    }
  }
}

export const walletService = new WalletService();
