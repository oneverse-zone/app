import { Blockchain } from '../../../entity/blockchain/blockchain';
import { Protocol } from '../../../entity/blockchain/protocol';

export const polygon: Blockchain = {
  id: 'polygon',
  name: 'Polygon',
  description:
    'Polygon (Matic) strives to solve the scalability and usability issues, while not compromising on decentralization and leveraging the existing developer community and ecosystem',
  website: 'https://polygon.technology/',
  explorer: 'https://polygonscan.com/',
  research: 'https://docs.matic.network/',
  protocol: Protocol.EVM,
  coinId: 966,
};
