import { action, makeAutoObservable, observable } from 'mobx';
import { mnemonicToSeed } from '@ethersproject/hdnode';
import Web3 from 'web3';
import { randomMnemonic } from '@oneverse/utils';
import { Chain } from '../constants/Blockchain';
import { ethereumApi } from '../constants/Url';

// import Web3 from 'web3';

/**
 * 钱包服务
 */
export class Wallet {
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
   * 钱包创建
   */
  @action
  async create(chain: Chain, password: string) {
    const mnemonic = randomMnemonic();
    const seedHexStr = mnemonicToSeed(mnemonic);
    await this.preCreateETH(seedHexStr);
    return mnemonic;
  }

  /**
   * 创建ETH账户
   * @param seedHexStr 秘钥种子 hex
   * @private
   */
  private async preCreateETH(seedHexStr: string) {
    const web3 = new Web3(ethereumApi);

    const account = web3.eth.accounts.privateKeyToAccount(seedHexStr);
    console.log(account);
  }
}

export const walletService = new Wallet();
