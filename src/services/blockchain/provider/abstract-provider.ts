import { blockchainService } from '../index';
import { Blockchain } from '../../../entity/blockchain/blockchain';
import { Coin } from '../../../entity/blockchain/coin';

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
   * @param coin 币信息
   */
  support(coin: Coin): boolean | Promise<boolean> {
    return blockchainService.blockchains.findIndex(item => item.coinId === coin.id) > -1;
  }

  /**
   * 获取币对应的链
   * @param coin 币信息
   */
  getBlockchain(coin: Coin): Blockchain | undefined {
    return blockchainService.blockchains.find(item => item.coinId === coin.id);
  }
}
