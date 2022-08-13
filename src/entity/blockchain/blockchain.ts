import { Protocol } from './protocol';

/**
 * 区块链
 * https://github.com/trustwallet/assets/tree/master/blockchains
 */
export type Blockchain = {
  id: string;
  name: string;
  description: string;
  website: string;
  explorer: string;
  research: string;
  /**
   * 主链币ID
   */
  coinId: number;
  /**
   * 协议
   */
  protocol: Protocol;
};
