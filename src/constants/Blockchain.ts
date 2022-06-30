import btc from '../assets/svg/bitcoin_logo.svg';
import eth from '../assets/svg/eth_logo.svg';

export type Chain = 'BTC' | 'ETC' | 'POLYGON' | 'BNB' | 'BSC';

export type Blockchain = {
  name: string;
  chain: Chain;
  symbol: string;
  logo: any;
};

/**
 * 支持的链列表
 */
export const blockchains: Array<Blockchain> = [
  {
    name: 'BTC',
    chain: 'BTC',
    symbol: 'BTC',
    logo: btc,
  },
  {
    name: 'Ethereum',
    chain: 'ETC',
    symbol: 'ETH',
    logo: eth,
  },
];
