import { CreateWalletAccountOptions, WalletProvider } from './api';
import { Token } from '../../entity/blockchain/token';
import { Coin } from '../../entity/blockchain/coin';
import { AccountToken, WalletAccount } from '../../entity/blockchain/wallet-account';

/**
 * 区块链适配器
 */
export class WalletAdapter implements WalletProvider {
  private providers: Array<WalletProvider> = [];

  support(blockchainId: string, coinId: number): boolean | Promise<boolean> {
    return true;
  }

  /**
   * 代理钱包创建
   * @param args
   */
  createAccount(args: CreateWalletAccountOptions): WalletAccount {
    return this.getProvider(args.coin.blockchainId, args.coin.id).createAccount(args);
  }

  getBalance(account: WalletAccount, token: AccountToken): Promise<string> {
    return this.getProvider(account.blockchainId, account.coinId).getBalance(account, token);
  }

  estimateGas(account: WalletAccount, transaction: any): Promise<string> {
    return this.getProvider(account.blockchainId, account.coinId).estimateGas(account, transaction);
  }

  getGasPrice(account: WalletAccount): Promise<string> {
    return this.getProvider(account.blockchainId, account.coinId).getGasPrice(account);
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
  private getProvider(blockchainId: string, coinId: number): WalletProvider {
    const provider = this.providers.find(item => item.support(blockchainId, coinId));
    if (provider) {
      return provider;
    }

    throw new Error(`不支持的Coin: ${blockchainId} ${coinId}`);
  }
}

export const walletAdapter = new WalletAdapter();