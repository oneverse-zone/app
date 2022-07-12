import { getDefaultProvider } from '@ethersproject/providers';
import { ethereumApi } from '../constants/Url';

/**
 * 节点服务
 */
export class BlockchainNode {
  /**
   * 获取以太坊最优节点
   */
  getEthereumProvider() {
    return getDefaultProvider(ethereumApi);
  }
}

export const blockchainNodeService = new BlockchainNode();
