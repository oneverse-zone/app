export enum NetworkType {
  Bitcoin = 'Bitcoin',
  /**
   * 以太坊系列
   */
  Ethereum = 'Ethereum',
}

/**
 * 区块链
 */
export type Blockchain = {
  id: string;
  name: string;
  description: string;
  website: string;
  explorer: string;
  research: string;
  logo: any;
  networkType: NetworkType;
};
