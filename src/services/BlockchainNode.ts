import { getDefaultProvider } from '@ethersproject/providers';
import { ethereumApi } from '../constants/Url';
import { makeResettable } from '../mobx/mobx-reset';

/**
 * 节点服务
 */
export class BlockchainNode {
  fastEthereumProvider;

  constructor() {
    makeResettable(this);
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
