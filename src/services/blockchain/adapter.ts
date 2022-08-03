import { WalletProvider } from './types';
import { WalletToken } from '../../entity/Wallet';

/**
 * 区块链适配器
 */
export class WalletAdapter implements WalletProvider {
  private providers: Array<WalletProvider> = [];

  support(token: WalletToken): boolean | Promise<boolean> {
    return true;
  }

  getBalance(token: WalletToken): Promise<string> {
    return this.getProvider(token).getBalance(token);
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
  private getProvider(token: WalletToken): WalletProvider {
    const provider = this.providers.find(item => item.support(token));
    if (provider) {
      return provider;
    }

    throw new Error('不支持的Token');
  }
}

export const walletAdapter = new WalletAdapter();
