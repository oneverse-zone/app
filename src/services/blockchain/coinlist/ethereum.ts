import { Coin } from '../../../entity/blockchain/coin';
import { ethereum, ethereumGoerli, ethereumRinkeby } from '../chainlist/ethereum';

/**
 * Ethereum
 */
export const eth: Coin = {
  id: 60,
  name: 'Ethereum',
  symbol: 'ETH',
  decimals: 18,
  // derivePath: "m/44'/60'/0'/0",
  blockchainId: ethereum.id,
};

export const ethRinkeby: Coin = {
  ...eth,
  name: 'Ethereum Rinkeby',
  symbol: 'ETH Rinkeby',
  blockchainId: ethereumRinkeby.id,
};

export const ethGoerli: Coin = {
  ...eth,
  name: 'Ethereum Goerli',
  symbol: 'ETH Goerli',
  blockchainId: ethereumGoerli.id,
};
