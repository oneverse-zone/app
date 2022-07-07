import { HDToken } from '../entity/Token';
import { btcBlockchain, ethBlockchain } from './Blockchain';

export const btcToken: HDToken = {
  coinId: 0,
  name: 'Bitcoin',
  symbol: 'BTC',
  decimals: 8,
  blockchain: btcBlockchain,
  derivePath: "m/44'/0'/0'/0",
};

export const ethToken: HDToken = {
  coinId: 60,
  name: 'Ethereum',
  symbol: 'ETH',
  decimals: 18,
  blockchain: ethBlockchain,
  derivePath: "m/44'/60'/0'/0",
};

/**
 * 系统支持的 HD token 列表
 */
export const hdTokens: Array<HDToken> = [btcToken, ethToken];
