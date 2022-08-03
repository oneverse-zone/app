import { WalletToken } from '../../entity/Wallet';

/**
 * 基础服务接口
 */
export interface IBase {}

/**
 * Wallet 服务接口
 */
export interface WalletProvider {
  /**
   * 是否支持该token
   * @param token
   */
  support(token: WalletToken): boolean | Promise<boolean>;

  /**
   * 获取Token余额
   * @param token token信息
   */
  getBalance(token: WalletToken): Promise<string>;

  // getTransactionCount(blockTag?: BlockTag): Promise<number>;
  //
  // estimateGas(transaction: Deferrable<TransactionRequest>): Promise<BigNumber>;
  //
  // sendTransaction(transaction: Deferrable<TransactionRequest>): Promise<TransactionResponse>;
}
