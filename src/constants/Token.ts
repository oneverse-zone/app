/*
 * Registered coin types for BIP-0044 https://github.com/satoshilabs/slips/blob/master/slip-0044.md
 */
import { Token, TokenType } from '../entity/Token';

import btcLogo from '../assets/svg/token-logo/bitcoin-btc.svg';
import ethLogo from '../assets/svg/token-logo/ethereum-eth.svg';
import maticLogo from '../assets/svg/token-logo/polygon-matic.svg';
import { btcBlockchain, ethBlockchain, polygonBlockchain } from './Blockchain';

/**
 * 主链币合约地址
 */
export const COIN_TOKEN_CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';

/**
 * Bitcoin
 */
export const btcToken: Token = {
  coinId: 0,
  name: 'Bitcoin',
  type: TokenType.COIN,
  contractAddress: COIN_TOKEN_CONTRACT_ADDRESS,
  symbol: 'BTC',
  decimals: 8,
  blockchain: btcBlockchain,
  logo: btcLogo,
  // derivePath: "m/44'/0'/0'/0",
};

/**
 * Ethereum
 */
export const ethToken: Token = {
  coinId: 60,
  name: 'Ethereum',
  type: TokenType.COIN,
  contractAddress: COIN_TOKEN_CONTRACT_ADDRESS,
  symbol: 'ETH',
  decimals: 18,
  blockchain: ethBlockchain,
  logo: ethLogo,
  // derivePath: "m/44'/60'/0'/0",
};

export const maticToken: Token = {
  coinId: 966,
  name: 'MATIC',
  type: TokenType.COIN,
  contractAddress: COIN_TOKEN_CONTRACT_ADDRESS,
  symbol: 'MATIC',
  decimals: 18,
  blockchain: polygonBlockchain,
  logo: maticLogo,
};
