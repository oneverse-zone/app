import { WalletProvider } from './types';
import { WalletToken } from '../../entity/Wallet';
import { NetworkType } from '../../entity/Blockchain';
import { walletAdapter } from './adapter';

/**
 * 以太坊系列钱包
 */
export class EthereumWalletProvider implements WalletProvider {
  support(token: WalletToken): boolean | Promise<boolean> {
    return token.blockchain.networkType === NetworkType.Ethereum;
  }

  getBalance(token: WalletToken): Promise<string> {
    return Promise.resolve('');
  }
}

walletAdapter.register(new EthereumWalletProvider());
