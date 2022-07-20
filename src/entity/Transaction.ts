import { TransactionReceipt, TransactionResponse } from '@ethersproject/abstract-provider/src.ts';

/**
 * 交易记录信息
 */
export type TokenTransaction = {
  walletIndex: number;
  address?: string;
} & TransactionReceipt &
  TransactionResponse;
