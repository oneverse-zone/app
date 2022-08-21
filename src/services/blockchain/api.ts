import { Coin } from '../../entity/blockchain/coin';
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
   * gas price 的单位
   */
  gasPriceUnit(account: WalletAccount): string;

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
  getGasPrice(account: WalletAccount): Promise<string>;

  // /**
  //  * 获取gas费率信息
  //  * @param account 交易账户
  //  */
  // getFeeData(account: WalletAccount): Promise<any>;

  /**
   * 获取gas费率档位信息
   * @param account 交易账户
   * @param gasLimit gas 限制
   */
  getGasFeeInfos(account: WalletAccount, gasLimit: string | bigint | number): Promise<Array<GasInfo>>;

  // getTransactionCount(blockTag?: BlockTag): Promise<number>;
  //
  // estimateGas(transaction: Deferrable<TransactionRequest>): Promise<BigNumber>;
  //
  /**
   * 发送交易
   * @param account 账户信息
   * @param transaction 交易信息
   */
  sendTransaction(wallet: Wallet, account: WalletAccount, transaction: any): Promise<any>;
}
