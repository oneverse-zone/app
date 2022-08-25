import { BaseToken, Coin } from '../../entity/blockchain/coin';
import { AccountToken, WalletAccount } from '../../entity/blockchain/wallet-account';
import { Wallet } from '../../entity/blockchain/wallet';
import { GasInfo } from '../../entity/blockchain/gas';

export type CreateHDWalletAccountOptions = {
  secretKey?: never;

  // 参数开始
  accountIndex: number;
  changeIndex: number;
  addressIndex: number;
  /**
   * 助记词
   */
  mnemonic: string;
  /**
   * 助记词密码
   */
  password?: string;
};

export type CreateSingleChainWalletAccountOptions = {
  accountIndex?: never;
  changeIndex?: never;
  addressIndex?: never;
  mnemonic?: never;
  password?: never;

  /**
   * 钱包秘钥
   */
  secretKey: string;
};

/**
 * 创建HD钱包选项
 */
export type CreateWalletAccountOptions = {
  name: string;
  coin: Coin;
} & (CreateHDWalletAccountOptions | CreateSingleChainWalletAccountOptions);

/**
 * 自定义GAS fee
 */
export type CustomGasFeeInfoOptions = {
  gasLimit: string;
  maxPriorityFeePerGas: string;
  maxFeePerGas: string;
};

export type TransactionOptions = {
  wallet: Wallet;
  account: WalletAccount;

  token: AccountToken;
  to: string;
  value: string;
  gasInfo: GasInfo;
  data?: string;
} & (
  | {
      secretKey?: never;
      /**
       * 助记词
       */
      mnemonic: string;
      /**
       * 助记词密码
       */
      password?: string;
    }
  | {
      mnemonic?: never;
      password?: never;

      secretKey: string;
    }
);

/**
 * 基础服务接口
 */
export interface BaseProvider {
  isEthereum(): boolean;

  isBitcoin(): boolean;

  isPolygon(): boolean;
}

/**
 * Wallet 服务接口
 */
export interface WalletProvider {
  /**
   * 是否支持该coin
   * @param blockchainId 链ID
   * @param coinId 币ID
   */
  support(blockchainId: string, coinId: number): boolean | Promise<boolean>;

  /**
   * 是否是一个地址
   * @param address 地址
   */
  isAddress(address: string): boolean;

  /**
   * gas price 的单位
   */
  gasPriceUnit(): string;

  /**
   * 创建钱包token
   */
  createAccount(args: CreateWalletAccountOptions): WalletAccount;

  /**
   * 获取Token余额
   * @param account 账户信息
   * @param token token 信息
   * @return 余额
   */
  getBalance(account: WalletAccount, token: AccountToken): Promise<string>;

  /**
   * 获取Token余额
   * @param account 账户信息
   * @param token token 信息
   * @return 余额 以主要的单位显示并做好小数位数处理
   */
  getBalanceUI(account: WalletAccount, token: AccountToken): Promise<string>;

  /**
   * 预估GAS
   * @param account 账户信息
   * @param transaction 交易信息
   */
  estimateGas(account: WalletAccount, transaction: any): Promise<string>;

  /**
   * 获取gas price
   */
  getGasPrice(): Promise<string>;

  /**
   * 获取gas费率档位信息
   * @param gasLimit gas 限制
   */
  getGasFeeInfos(gasLimit: string | bigint | number): Promise<Array<GasInfo>>;

  customGasFeeInfo(options: CustomGasFeeInfoOptions): Promise<GasInfo>;

  /**
   * 获取Token信息
   * @param address 合约地址
   */
  getTokenInfo(address: string): Promise<BaseToken | undefined>;

  /**
   * 发送交易
   * @param options 交易选项
   */
  sendTransaction(options: TransactionOptions): Promise<any>;
}
