/*
 * Registered coin types for BIP-0044 https://github.com/satoshilabs/slips/blob/master/slip-0044.md
 */
import { Coin } from '../../entity/blockchain/coin';
import { ethereum, bitcoin, polygon } from './index';

/**
 * Bitcoin
 */
export const btc: Coin = {
  id: 0,
  name: 'Bitcoin',
  symbol: 'BTC',
  decimals: 8,
  // derivePath: "m/44'/0'/0'/0",
  blockchainId: bitcoin.id,
};

/**
 * Ethereum
 */
export const eth: Coin = {
  id: 60,
  name: 'Ethereum',
  symbol: 'ETH',
  decimals: 18,
  // derivePath: "m/44'/60'/0'/0",
  blockchainId: ethereum.id,
};

export const matic: Coin = {
  id: 966,
  name: 'MATIC',
  symbol: 'MATIC',
  decimals: 18,
  blockchainId: polygon.id,
};

class CoinService {
  // systemCoins = [btc, eth, matic];
  systemCoins = [eth];

  /**
   * 返回所有币种信息
   */
  get coins() {
    return [...this.systemCoins];
  }

  findById(id: number): Coin | undefined {
    return this.coins.find(item => item.id === id);
  }
}

export const coinService = new CoinService();
