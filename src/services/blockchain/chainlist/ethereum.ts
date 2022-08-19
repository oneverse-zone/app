import { Blockchain } from '../../../entity/blockchain/blockchain';
import { Protocol } from '../../../entity/blockchain/protocol';

export const ethereum: Blockchain = {
  id: 'ethereum',
  name: 'Ethereum',
  description: 'Open source platform to write and distribute decentralized applications.',
  website: 'https://ethereum.org/',
  explorer: 'https://etherscan.io/',
  research: 'https://research.binance.com/en/projects/ethereum',
  protocol: Protocol.EVM,
  coinId: 60,
};

export const ethereumRinkeby: Blockchain = {
  ...ethereum,
  id: 'ethereum-rinkeby',
  name: 'Ethereum Test Rinkeby',
};

export const ethereumGoerli: Blockchain = {
  ...ethereum,
  id: 'ethereum-goerli',
  name: 'Ethereum Test Goerli',
};
