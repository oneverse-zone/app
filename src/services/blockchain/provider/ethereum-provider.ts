import { BaseProvider, CreateWalletAccountOptions, WalletProvider } from '../types';
import { formatUnits } from '@ethersproject/units';
import { VoidSigner } from '@ethersproject/abstract-signer';
import { Wallet as BlockchainWallet } from '@ethersproject/wallet';
import { HDNode } from '@ethersproject/hdnode';
import { getDefaultProvider } from '@ethersproject/providers';

import { walletAdapter } from '../adapter';
import { AbstractProvider } from './abstract-provider';
import { WalletAccount } from '../../../entity/blockchain/wallet-account';
import { Coin } from '../../../entity/blockchain/coin';
import { blockchainNodeService } from '../node';

/**
 * 以太坊系列钱包基础实现
 */
export abstract class BaseEthereumWalletProvider extends AbstractProvider implements WalletProvider {
  createAccount(args: CreateWalletAccountOptions): WalletAccount {
    const { name, coin, secretKey, mnemonic, password, accountIndex = 0, changeIndex = 0, addressIndex = 0 } = args;
    if (!secretKey && !mnemonic) {
      throw new Error('助记词和密码必须传递一个');
    }
    let wallet;
    let derivePath: string;
    if (secretKey) {
      wallet = new BlockchainWallet(secretKey);
    } else if (mnemonic) {
      derivePath = `m/44'/${coin.id}'/${accountIndex}'/${changeIndex}/${addressIndex}`;
      wallet = new BlockchainWallet(HDNode.fromMnemonic(mnemonic, password).derivePath(derivePath));
    }

    const base = {
      name,
      address: wallet?.address!,
      balance: 0,
      coin,
      tokens: [],
    };

    // sign chain
    if (secretKey) {
      return {
        ...base,
      };
    }

    return {
      ...base,
      // hd wallet
      coinType: coin.id,
      accountIndex,
      changeIndex,
      addressIndex,
      derivePath: derivePath!,
    };
  }

  async getBalance(account: WalletAccount): Promise<string> {
    const provider = this.getProvider(account.coin);
    const balanceWei = await provider.getBalance(account.address);
    return formatUnits(balanceWei);
  }

  async estimateGas(account: WalletAccount, transaction: any): Promise<string> {
    const provider = this.getProvider(account.coin);
    const signer = new VoidSigner(account.address, provider);
    const value = await signer.estimateGas(transaction);
    return value.toString();
  }

  async getGasPrice(account: WalletAccount): Promise<string> {
    const provider = this.getProvider(account.coin);
    const gasPrice = await provider.getGasPrice();
    return gasPrice.toString();
  }

  protected getProvider(coin: Coin) {
    const blockchain = this.getBlockchain(coin);
    if (null == blockchain) {
      throw new Error(`不支持的币: ${coin.id} ${coin.name}`);
    }
    const fastNode = blockchainNodeService.getFastNode(blockchain);
    return getDefaultProvider(fastNode.network);
  }
}

/**
 * 以太坊钱包提供者
 */
export class EthereumWalletProvider extends BaseEthereumWalletProvider implements BaseProvider {
  isEthereum(): boolean {
    return true;
  }
}

walletAdapter.register(new EthereumWalletProvider());
