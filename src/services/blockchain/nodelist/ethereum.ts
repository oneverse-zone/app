import { NetworkNode } from '../../../entity/blockchain/network-node';
import { ethereum, ethereumGoerli, ethereumRinkeby } from '../chainlist/ethereum';

export const ethereumMainNets = [
  {
    blockchainId: ethereum.id,
    builtIn: true,
    chainId: 1,
    name: 'Ethereum Alchemy Mainnet',
    network: 'mainnet',
    networkOptions: {
      alchemy: 'wGtZ4rt6aMACfm7hOcPfhYr0dD3Rwi8r',
    },
  },
  {
    blockchainId: ethereum.id,
    builtIn: true,
    chainId: 1,
    name: 'Ethereum Infura Mainnet',
    network: 'https://mainnet.infura.io/v3/4d50c70ad0464d0282743490b3fe18f1',
  },
];

export const ethereumGoerliNets: Array<NetworkNode> = [
  {
    blockchainId: ethereumGoerli.id,
    builtIn: true,
    chainId: 1,
    name: 'Ethereum Alchemy Goerli',
    network: 'goerli',
    networkOptions: {
      alchemy: 'wGtZ4rt6aMACfm7hOcPfhYr0dD3Rwi8r',
    },
  },
  {
    blockchainId: ethereumGoerli.id,
    builtIn: true,
    chainId: 1,
    name: 'Ethereum Infura Goerli',
    network: 'https://goerli.infura.io/v3/4d50c70ad0464d0282743490b3fe18f1',
  },
];

export const ethereumRinkebyNets: Array<NetworkNode> = [
  {
    blockchainId: ethereumRinkeby.id,
    builtIn: true,
    chainId: 1,
    name: 'Ethereum Infura Rinkeby',
    network: 'https://rinkeby.infura.io/v3/4d50c70ad0464d0282743490b3fe18f1',
  },
];
