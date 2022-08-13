import { CreateWalletAccountOptions, WalletProvider } from './types';
import { Token } from '../../entity/blockchain/token';
import { Coin } from '../../entity/blockchain/coin';
import { WalletAccount } from '../../entity/blockchain/wallet-account';

/**
 * 区块链适配器
 */
export class WalletAdapter implements WalletProvider {
  private providers: Array<WalletProvider> = [];

  support(token: Token): boolean | Promise<boolean> {
    return true;
  }

  /**
   * 代理钱包创建
   * @param args
   */
  createAccount(args: CreateWalletAccountOptions): WalletAccount {
    return this.getProvider(args.coin).createAccount(args);
  }

  getBalance(account: WalletAccount): Promise<string> {
    return this.getProvider(account.coin).getBalance(account);
  }

  estimateGas(account: WalletAccount, transaction: any): Promise<string> {
    return this.getProvider(account.coin).estimateGas(account, transaction);
  }

  getGasPrice(account: WalletAccount): Promise<string> {
    return this.getProvider(account.coin).getGasPrice(account);
  }

  /**
   * 适配器注册
   * @param provider
   */
  register(provider: WalletProvider) {
    this.providers.push(provider);
  }

  /**
   * 获取提供者
   * @private
   */
  private getProvider(coin: Coin): WalletProvider {
    const provider = this.providers.find(item => item.support(coin));
    if (provider) {
      return provider;
    }

    throw new Error('不支持的Coin');
  }
}

export const walletAdapter = new WalletAdapter();
