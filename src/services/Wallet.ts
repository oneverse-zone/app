import { action, makeAutoObservable, observable } from 'mobx';
import Web3 from 'web3';
import { Wallet } from '@ethersproject/wallet';
import { mnemonicToSeed, randomMnemonic } from '@oneverse/utils';
import { ethereumApi } from '../constants/Url';
import * as u8a from 'uint8arrays';
import { hdTokens } from '../constants/Token';
import { Blockchain } from '../entity/Blockchain';

/**
 * 钱包服务
 */
export class WalletService {
  @observable
  loading = false;

  /**
   * 钱包列表
   */
  list: Array<any> = [];

  constructor() {
    makeAutoObservable(this, undefined, {
      autoBind: true,
    });
  }

  /**
   * 查询本地钱包列表
   */
  async query() {}

  /**
   * 创建HD钱包
   */
  @action
  async createHD() {
    const mnemonic = randomMnemonic();
    console.log(mnemonic);
    const wallets = hdTokens.map(token => Wallet.fromMnemonic(mnemonic, `${token.derivePath}/0`));
    wallets.forEach(item => {
      console.log(`Address: ${item.address}`);
      console.log(`PRK: ${item.privateKey}`);
      console.log('==========');
    });
  }

  /**
   * 钱包创建
   */
  @action
  async create(chain: Blockchain, password: string) {
    const mnemonic = randomMnemonic();
    const seed = mnemonicToSeed(mnemonic);
    await this.preCreateETH(seed);
    return mnemonic;
  }

  /**
   * 创建ETH账户
   * @param seed 秘钥种子
   * @private 内部调用
   */
  private async preCreateETH(seed: Uint8Array) {
    const web3 = new Web3(ethereumApi);
    const seedHexStr = u8a.toString(seed, 'base16');
    const account = web3.eth.accounts.privateKeyToAccount(seedHexStr);
    console.log(account);
  }
}

export const walletService = new WalletService();
