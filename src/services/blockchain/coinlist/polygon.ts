import { Coin } from '../../../entity/blockchain/coin';
import { polygon } from '../chainlist/polygon';

export const matic: Coin = {
  id: 966,
  name: 'MATIC',
  symbol: 'MATIC',
  decimals: 18,
  blockchainId: polygon.id,
};
