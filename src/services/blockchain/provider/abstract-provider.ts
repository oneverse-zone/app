import { blockchainService } from '../index';

/**
 * 基础提供者实现
 */
export abstract class AbstractProvider {
  isEthereum(): boolean {
    return false;
  }

  isBitcoin(): boolean {
    return false;
  }

  isPolygon(): boolean {
    return false;
  }

  /**
   * 判断是否支持该币种
   */
  support(blockchainId: string, coinId: number): boolean | Promise<boolean> {
    return false;
  }

  findBlockchainById(blockchainId: string) {
    return blockchainService.blockchains.find(item => item.id === blockchainId);
  }
}
