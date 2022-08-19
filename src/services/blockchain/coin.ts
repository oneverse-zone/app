/*
 * Registered coin types for BIP-0044 https://github.com/satoshilabs/slips/blob/master/slip-0044.md
 */
import { Coin } from '../../entity/blockchain/coin';
import { eth, ethGoerli, ethRinkeby } from './coinlist/ethereum';

class CoinService {
  // systemCoins = [btc, eth, matic];
  systemCoins = [eth, ethRinkeby, ethGoerli];

  /**
   * 返回所有币种信息
   */
  get coins() {
    return [...this.systemCoins];
  }

  findByBlockchainId(id: string): Coin | undefined {
    return this.coins.find(item => item.blockchainId === id);
  }
}

export const coinService = new CoinService();
