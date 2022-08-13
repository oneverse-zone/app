/*
 * Registered coin types for BIP-0044 https://github.com/satoshilabs/slips/blob/master/slip-0044.md
 */
import { Coin } from '../../entity/blockchain/coin';
import { ethereum } from './index';

/**
 * 主链币合约地址
 */
export const COIN_TOKEN_CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';

/**
 * Bitcoin
 */
export const btc: Coin = {
  id: 0,
  name: 'Bitcoin',
  symbol: 'BTC',
  decimals: 8,
  // derivePath: "m/44'/0'/0'/0",
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
};

export const matic: Coin = {
  id: 966,
  name: 'MATIC',
  symbol: 'MATIC',
  decimals: 18,
};

class CoinService {
  systemCoins = [btc, eth, matic];

  /**
   * 返回所有币种信息
   */
  get coins() {
    return [...this.systemCoins];
  }
}

export const coinService = new CoinService();
