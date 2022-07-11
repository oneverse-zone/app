import { Blockchain } from '../entity/Blockchain';

export const btcBlockchain: Blockchain = {
  name: 'Bitcoin',
  description:
    'Bitcoin is a cryptocurrency and worldwide payment system. It is the first decentralized digital currency, as the system works without a central bank or single administrator.',
  website: 'https://bitcoin.org',
  explorer: 'https://blockchain.info',
  research: 'https://research.binance.com/en/projects/bitcoin',
};

export const ethBlockchain: Blockchain = {
  name: 'Ethereum',
  description: 'Open source platform to write and distribute decentralized applications.',
  website: 'https://ethereum.org/',
  explorer: 'https://etherscan.io/',
  research: 'https://research.binance.com/en/projects/ethereum',
};

export const polygonBlockchain: Blockchain = {
  name: 'Polygon',
  description:
    'Polygon (Matic) strives to solve the scalability and usability issues, while not compromising on decentralization and leveraging the existing developer community and ecosystem',
  website: 'https://polygon.technology/',
  explorer: 'https://polygonscan.com/',
  research: 'https://docs.matic.network/',
};

export const blockchains = [btcBlockchain, ethBlockchain, polygonBlockchain];
