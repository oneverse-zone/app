import { action, makeAutoObservable, observable } from 'mobx';
import { VoidSigner } from '@ethersproject/abstract-signer';
import { Wallet as BlockchainWallet } from '@ethersproject/wallet';
import { HDNode } from '@ethersproject/hdnode';
import { formatUnits, parseEther } from '@ethersproject/units';
import { BigNumber } from '@ethersproject/bignumber';
import { TransactionRequest } from '@ethersproject/abstract-provider';
import { Decimal } from 'decimal.js';
import { Wallet, WalletToken, WalletType } from '../entity/Wallet';
import { Token } from '../entity/Token';
import { makePersistable } from 'mobx-persist-store';
import { Toast } from 'native-base';
import { lang } from '../locales';
import { blockchainNodeService } from './BlockchainNode';
import { repository } from './Repository';
import { TokenTransaction } from '../entity/Transaction';
import { parseUnits } from '@ethersproject/units/src.ts';
import { randomUint32 } from '@stablelib/random/random';
import { tokenTransactionService } from './TokenTransaction';
import { blockchainService } from './Blockchain';
import { tokenService } from './Token';

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
  wallet: Wallet | undefined = undefined;

  /**
   * 单链钱包
   */
  @observable
  list: Array<Wallet> = [];

  /**
   * 单链钱包地址索引
   * key 为coinId
   * value 为 address index
   * <pre>
   *     singleChainWalletAddressIndex = {
   *         0: 1,
   *         60: 0
   *     }
   * </pre>
   */
  @observable
  singleChainWalletAddressIndex: Record<number, number> = {};
  /**
   * 身份钱包地址索引
   */
  @observable
  hdWalletAddressIndex: Record<number, number> = {};

  /**
   * 交易记录信息
   */
  @observable
  transactions: Array<TokenTransaction> = [];

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
      properties: ['wallet', 'list', 'selectedIndex', 'singleChainWalletAddressIndex', 'hdWalletAddressIndex'],
    }).finally(() => {
      // 更新钱余额信息
      this.updateSelectWalletBalance();
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

  @action
  selectWallet(index: number) {
    this.list[index] && (this.selectedIndex = index);
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
        tokens: tokenService.hdTokens.map(token => {
          const derivePath = `m/44'/${token.coinId}'/0'/0/0`;
          const tmp = new BlockchainWallet(HDNode.fromMnemonic(mnemonic, password).derivePath(derivePath));
          const walletToken: WalletToken = {
            ...token,
            walletName: `HD-${token.symbol}-0`,
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
   * 派生HD钱包
   * @param token
   * @param name
   */
  @action
  async createHD(token: Token, name: string) {
    if (this.loading) {
      return;
    }
    this.loading = true;
    try {
      const mnemonicData: any = await repository.findMnemonic(true);
      if (!mnemonicData || typeof mnemonicData === 'string') {
        console.log(`助记词不存在`);
        return;
      }
      const { mnemonic, password } = mnemonicData;

      const addressIndex = (this.hdWalletAddressIndex[token.coinId] || 0) + 1;

      const derivePath = `m/44'/${token.coinId}'/0'/0/${addressIndex}`;
      const tmp = new BlockchainWallet(HDNode.fromMnemonic(mnemonic, password).derivePath(derivePath));
      const walletToken: WalletToken = {
        ...token,
        walletName: name,
        address: tmp.address,
        balance: 0,
        derivePath,
      };
      this.hdWalletAddressIndex[token.coinId] = addressIndex;
      this.wallet?.tokens.push(walletToken);
      this.updateSelectWalletBalance();
    } finally {
      this.loading = false;
    }
  }

  /**
   * 钱包创建
   */
  @action
  async create(token: Token, name: string, mnemonic: string, password?: string) {
    if (this.loading) {
      return;
    }
    this.loading = false;
    try {
      // m/44'/60'/0'/0/address_index
      const addressIndex = (this.singleChainWalletAddressIndex[token.coinId] || -1) + 1;
      const derivePath = `m/44'/${token.coinId}/0'/0/${addressIndex}`;
      const tmp = new BlockchainWallet(HDNode.fromMnemonic(mnemonic, password).derivePath(derivePath));
      const idx = this.list.findIndex(item => item.tokens.findIndex(t => t.contractAddress === tmp.address) > -1);
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
        name: `${token.symbol}-${index + 1}`,
        type: WalletType.SINGLE_CHAIN,
        tokens: [
          {
            ...token,
            walletName: name,
            address: tmp.address,
            balance: 0,
            derivePath,
          },
        ],
      };
      // 更新索引
      this.singleChainWalletAddressIndex[token.coinId] = addressIndex;
      this.list = [...this.list, wallet];
      this.updateSelectWalletBalance();
    } finally {
      this.loading = false;
    }
  }

  /**
   * 更新选择钱包的信息
   */
  async updateSelectWalletBalance() {
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
   * @param gasPrice
   * @param gasLimit
   */
  async sendTransaction(
    fromToken: WalletToken,
    toAddress: string,
    value: string | number,
    gasPrice: string,
    gasLimit: string,
  ) {
    if (this.loading) {
      return;
    }
    const { mnemonic, password }: any = (await repository.findMnemonic(true)) || {};
    if (!mnemonic) {
      console.error('用户助记词不存在');
      return;
    }
    if (!this.selected) {
      console.log('钱包未选择');
      return;
    }

    try {
      const provider = blockchainNodeService.ethereumProvider;
      const wallet = new BlockchainWallet(
        HDNode.fromMnemonic(mnemonic, password).derivePath(fromToken.derivePath),
        provider,
      );
      const tx: TransactionRequest = {
        to: toAddress,
        // 页面输入 Ether 需要转换成Wei
        value: parseEther(`${value}`),
        // 页面输入 GWei 需要转换成Wei
        gasPrice: parseUnits(gasPrice, 'gwei'),
        gasLimit: BigNumber.from(gasLimit),
      };
      console.log(`TransactionRequest: `, tx);
      const txRes = await wallet.sendTransaction(tx);
      console.log(`TransactionResponse: `, txRes);

      const walletIndex = this.selected.index;

      const transaction: TokenTransaction = {
        walletIndex,
        address: fromToken.contractAddress,
        ...(txRes as any),
      };
      tokenTransactionService.save(transaction);
    } catch (e: any) {
      console.log('转账失败', e);
    } finally {
      this.loading = false;
    }
  }

  /**
   * 预估gas 信息
   * @param fromToken
   */
  async estimateGasInfo(fromToken: WalletToken): Promise<{ gasPrice: string; gasLimit: string }> {
    const provider = blockchainNodeService.ethereumProvider;
    const signer = new VoidSigner(fromToken.contractAddress, provider);
    const value = await signer.estimateGas({
      from: fromToken.contractAddress,
      to: fromToken.contractAddress,
      nonce: randomUint32(),
    });
    const gasPrice = await signer.getGasPrice();

    return {
      gasPrice: formatUnits(gasPrice, 'gwei'),
      gasLimit: value.toString(),
    };
  }

  /**
   * 获取余额
   * @param address
   */
  async getBalance({ address }: WalletToken) {
    try {
      const provider = blockchainNodeService.ethereumProvider;
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
