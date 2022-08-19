import { Blockchain } from '../../../entity/blockchain/blockchain';
import { Protocol } from '../../../entity/blockchain/protocol';

export const bitcoin: Blockchain = {
  id: 'bitcoin',
  name: 'Bitcoin',
  description:
    'Bitcoin is a cryptocurrency and worldwide payment system. It is the first decentralized digital currency, as the system works without a central bank or single administrator.',
  website: 'https://bitcoin.org',
  explorer: 'https://blockchain.info',
  research: 'https://research.binance.com/en/projects/bitcoin',
  protocol: Protocol.Bitcoin,
  coinId: 0,
};
