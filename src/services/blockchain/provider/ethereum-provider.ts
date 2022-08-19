import { BaseProvider, CreateWalletAccountOptions, WalletProvider } from '../api';
import { formatUnits } from '@ethersproject/units';
import { VoidSigner } from '@ethersproject/abstract-signer';
import { Wallet as BlockchainWallet } from '@ethersproject/wallet';
import { HDNode } from '@ethersproject/hdnode';
import { getDefaultProvider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';

import { walletAdapter } from '../adapter';
import { AbstractProvider } from './abstract-provider';
import { AccountToken, WalletAccount } from '../../../entity/blockchain/wallet-account';
import { blockchainNodeService } from '../blockchain-node';
import { TokenType } from '../../../entity/blockchain/token';
import { ethereum } from '../chainlist/ethereum';

// The minimum ABI to get ERC20 Token balance
const ERC20_BASE_ABI = [
  // balanceOf
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
];

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

    const defaultAccount: WalletAccount = {
      id: '', //由业务服务自行设置
      walletId: '', //由业务服务自行设置
      blockchainId: coin.blockchainId,
      coinId: coin.id,
      name,
      address: wallet?.address!,
      tokens: [],
    };

    // sign chain
    if (secretKey) {
      return defaultAccount;
    }

    return {
      ...defaultAccount,
      // hd wallet
      accountIndex,
      changeIndex,
      addressIndex,
      derivePath: derivePath!,
    };
  }

  async getBalance(account: WalletAccount, token: AccountToken): Promise<string> {
    const provider = this.getProvider(account.blockchainId);
    if (token.type === TokenType.COIN) {
      const balanceWei = await provider.getBalance(account.address);
      return formatUnits(balanceWei);
    }
    const contract = new Contract(token.address, ERC20_BASE_ABI, provider);
    return await contract.balanceOf(account.address);
  }

  async estimateGas(account: WalletAccount, transaction: any): Promise<string> {
    const provider = this.getProvider(account.blockchainId);
    const signer = new VoidSigner(account.address, provider);
    const value = await signer.estimateGas(transaction);
    return value.toString();
  }

  async getGasPrice(account: WalletAccount): Promise<string> {
    const provider = this.getProvider(account.blockchainId);
    const gasPrice = await provider.getGasPrice();
    return gasPrice.toString();
  }

  protected getProvider(blockchainId: string) {
    const blockchain = this.findBlockchainById(blockchainId);
    if (null == blockchain) {
      throw new Error(`不支持的链: ${blockchainId}`);
    }
    console.log(`${blockchain.name} 提供服务`);
    const fastNode = blockchainNodeService.getFastNode(blockchain);
    return getDefaultProvider(fastNode.network);
  }
}

/**
 * 以太坊钱包提供者
 */
export class EthereumWalletProvider extends BaseEthereumWalletProvider implements BaseProvider {
  support(blockchainId: string, coinId: number): boolean | Promise<boolean> {
    return coinId === ethereum.coinId;
  }

  isEthereum(): boolean {
    return true;
  }
}

walletAdapter.register(new EthereumWalletProvider());
