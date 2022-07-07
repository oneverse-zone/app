import btcLogo from '../assets/svg/bitcoin_logo.svg';
import ethLogo from '../assets/svg/eth_logo.svg';
import { Blockchain } from '../entity/Blockchain';

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

export const blockchains = [btcBlockchain, ethBlockchain];
