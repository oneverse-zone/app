import { Coin } from '../../../entity/blockchain/coin';
import { bitcoin } from '../chainlist/bitcoin';

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
