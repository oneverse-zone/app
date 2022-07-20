import { getDefaultProvider } from '@ethersproject/providers';
import { ethereumApi } from '../constants/Url';

/**
 * 节点服务
 */
export class BlockchainNode {
  fastEthereumProvider;

  constructor() {
    this.fastEthereumProvider = getDefaultProvider(ethereumApi);
  }

  /**
   * 获取以太坊最优节点
   */
  get ethereumProvider() {
    return this.fastEthereumProvider;
  }
}

export const blockchainNodeService = new BlockchainNode();
