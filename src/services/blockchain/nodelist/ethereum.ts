import { NetworkNode } from '../../../entity/blockchain/network-node';
import { ethereum, ethereumGoerli, ethereumRinkeby } from '../chainlist/ethereum';
import { config } from '../../../core/config';

export const ethereumMainNets = [
  // {
  //   blockchainId: ethereum.id,
  //   builtIn: true,
  //   chainId: 1,
  //   name: 'Ethereum Alchemy Mainnet',
  //   network: 'mainnet',
  //   networkOptions: {
  //     alchemy: config.alchemyApiKey,
  //   },
  // },
  {
    blockchainId: ethereum.id,
    builtIn: true,
    chainId: 1,
    name: 'Ethereum Infura Mainnet',
    network: 'mainnet',
    networkOptions: {
      infura: config.infuraApiKey,
    },
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
      alchemy: config.alchemyApiKey,
    },
  },
  {
    blockchainId: ethereumGoerli.id,
    builtIn: true,
    chainId: 1,
    name: 'Ethereum Infura Goerli',
    network: 'goerli',
    networkOptions: {
      infura: config.infuraApiKey,
    },
  },
];

export const ethereumRinkebyNets: Array<NetworkNode> = [
  // {
  //   blockchainId: ethereumRinkeby.id,
  //   builtIn: true,
  //   chainId: 1,
  //   name: 'Ethereum Alchemy Rinkeby',
  //   network: 'rinkeby',
  //   networkOptions: {
  //     alchemy: config.alchemyApiKey,
  //   },
  // },
  {
    blockchainId: ethereumRinkeby.id,
    builtIn: true,
    chainId: 1,
    name: 'Ethereum Infura Rinkeby',
    network: 'rinkeby',
    networkOptions: {
      infura: config.infuraApiKey,
    },
  },
];
