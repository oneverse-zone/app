import { Blockchain } from '../entity/Blockchain';
import btcLogo from '../assets/svg/token-logo/bitcoin-btc.svg';
import ethLogo from '../assets/svg/token-logo/ethereum-eth.svg';
import maticLogo from '../assets/svg/token-logo/polygon-matic.svg';

export const btcBlockchain: Blockchain = {
  name: 'Bitcoin',
  description:
    'Bitcoin is a cryptocurrency and worldwide payment system. It is the first decentralized digital currency, as the system works without a central bank or single administrator.',
  website: 'https://bitcoin.org',
  explorer: 'https://blockchain.info',
  research: 'https://research.binance.com/en/projects/bitcoin',
  logo: btcLogo,
};

export const ethBlockchain: Blockchain = {
  name: 'Ethereum',
  description: 'Open source platform to write and distribute decentralized applications.',
  website: 'https://ethereum.org/',
  explorer: 'https://etherscan.io/',
  research: 'https://research.binance.com/en/projects/ethereum',
  logo: ethLogo,
};

export const polygonBlockchain: Blockchain = {
  name: 'Polygon',
  description:
    'Polygon (Matic) strives to solve the scalability and usability issues, while not compromising on decentralization and leveraging the existing developer community and ecosystem',
  website: 'https://polygon.technology/',
  explorer: 'https://polygonscan.com/',
  research: 'https://docs.matic.network/',
  logo: maticLogo,
};
