import { BaseProvider, CreateWalletAccountOptions, WalletProvider } from '../api';
import { formatEther, formatUnits } from '@ethersproject/units';
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
import { Wallet } from '../../../entity/blockchain/wallet';
import { GasGear, GasInfo } from '../../../entity/blockchain/gas';
import { BigNumber } from '@ethersproject/bignumber';
import { BigNumberish } from '@ethersproject/bignumber/src.ts/bignumber';

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

const UI_MAIN_UNIT_DECIMALS = 8;
const GAS_PRICE_UNIT = 'gwei';

function formatGasInfo({
  lastBaseFeePerGas,
  maxPriorityFeePerGas,
  maxFeePerGas,
  gasLimit,
  minGasFee,
  maxGasFee,
  gear,
  time,
}: {
  gasLimit: GasInfo['gasLimit'];
  gear: GasInfo['gear'];
  time: GasInfo['time'];
  [key: string]: BigNumberish;
}): GasInfo {
  return {
    lastBaseFeePerGas: lastBaseFeePerGas.toString(),
    maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
    maxPriorityFeePerGasUI: formatUnits(maxPriorityFeePerGas, GAS_PRICE_UNIT),

    maxFeePerGas: maxFeePerGas.toString(),
    maxFeePerGasUI: formatUnits(maxFeePerGas, GAS_PRICE_UNIT),

    gasLimit: gasLimit,

    minGasFee: minGasFee.toString(),
    minGasFeeUI: Number.parseFloat(formatEther(minGasFee)).toFixed(UI_MAIN_UNIT_DECIMALS),

    maxGasFee: maxGasFee.toString(),
    maxGasFeeUI: Number.parseFloat(formatEther(maxGasFee)).toFixed(UI_MAIN_UNIT_DECIMALS),

    gear,
    time,
  };
}

/**
 * 以太坊系列钱包基础实现
 */
export abstract class BaseEthereumWalletProvider extends AbstractProvider implements WalletProvider {
  gasPriceUnit(account: WalletAccount): string {
    return GAS_PRICE_UNIT;
  }

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
      return balanceWei.toString();
    }
    const contract = new Contract(token.address, ERC20_BASE_ABI, provider);
    return await contract.balanceOf(account.address);
  }

  async getBalanceUI(account: WalletAccount, token: AccountToken): Promise<string> {
    const balance = await this.getBalance(account, token);
    if (token.type === TokenType.COIN) {
      return Number.parseFloat(formatUnits(balance)).toFixed(UI_MAIN_UNIT_DECIMALS);
    }
    return balance;
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
    return formatUnits(gasPrice, this.gasPriceUnit(account));
  }

  /**
   * 以太坊GAS档位设置方案
   * 最慢 maxPriorityFeePerGas = 1.47gwei
   * 标准 maxPriorityFeePerGas = 1.5gwei
   * 最快 maxPriorityFeePerGas = 2gwei
   *
   * maxFeePerGas = baseFeePerGas * 2 + maxPriorityFeePerGas
   *
   * 区间规则: min = (BaseFee + PriorityFee)* Gas, max = MaxFee * Gas
   */
  async getGasFeeInfos(account: WalletAccount, gasLimit: string | bigint | number): Promise<Array<GasInfo>> {
    const provider = this.getProvider(account.blockchainId);
    const feeData = await provider.getFeeData();

    const { lastBaseFeePerGas } = feeData;
    if (!lastBaseFeePerGas) {
      return [];
    }

    const baseFeePerGasDouble = lastBaseFeePerGas.mul(2);

    const lowMaxPriorityFeePerGas = BigNumber.from(1470000000);
    const lowMaxFeePerGas = baseFeePerGasDouble.add(lowMaxPriorityFeePerGas);
    const lowMinGasFee = lastBaseFeePerGas.add(lowMaxPriorityFeePerGas).mul(gasLimit);
    const lowMaxGasFee = lowMaxFeePerGas.mul(gasLimit);

    const low: GasInfo = formatGasInfo({
      lastBaseFeePerGas: lastBaseFeePerGas,
      maxPriorityFeePerGas: lowMaxPriorityFeePerGas,

      maxFeePerGas: lowMaxFeePerGas,

      gasLimit: gasLimit,

      minGasFee: lowMinGasFee,

      maxGasFee: lowMaxGasFee,

      gear: GasGear.LOW,
      // 10 分钟
      time: 10 * 60,
    });

    const fastMaxPriorityFeePerGas = BigNumber.from(2000000000);
    const fastMaxFeePerGas = baseFeePerGasDouble.add(fastMaxPriorityFeePerGas);
    const fastMinGasFee = lastBaseFeePerGas.add(fastMaxPriorityFeePerGas).mul(gasLimit);
    const fastMaxGasFee = fastMaxFeePerGas.mul(gasLimit);

    const fast: GasInfo = formatGasInfo({
      lastBaseFeePerGas: lastBaseFeePerGas,
      maxPriorityFeePerGas: fastMaxPriorityFeePerGas,

      maxFeePerGas: fastMaxFeePerGas,

      gasLimit: gasLimit,

      minGasFee: fastMinGasFee,

      maxGasFee: fastMaxGasFee,

      gear: GasGear.FAST,
      // 30s
      time: 30,
    });

    const standardMaxPriorityFeePerGas = BigNumber.from(1500000000);
    const standardMaxFeePerGas = baseFeePerGasDouble.add(standardMaxPriorityFeePerGas);
    const standardMinGasFee = lastBaseFeePerGas.add(standardMaxPriorityFeePerGas).mul(gasLimit);
    const standardMaxGasFee = standardMaxFeePerGas.mul(gasLimit);
    const standard: GasInfo = formatGasInfo({
      lastBaseFeePerGas: lastBaseFeePerGas,
      maxPriorityFeePerGas: standardMaxPriorityFeePerGas,
      maxFeePerGas: standardMaxFeePerGas,
      gasLimit: gasLimit,

      minGasFee: standardMinGasFee,
      maxGasFee: standardMaxGasFee,

      gear: GasGear.STANDARD,
      // 3 分钟
      time: 3 * 60,
    });

    return [fast, standard, low];
  }

  sendTransaction(wallet: Wallet, account: WalletAccount, transaction: any): Promise<any> {
    const provider = this.getProvider(account.blockchainId);
    return Promise.resolve(undefined);
  }

  protected getProvider(blockchainId: string) {
    const blockchain = this.findBlockchainById(blockchainId);
    if (null == blockchain) {
      throw new Error(`不支持的链: ${blockchainId}`);
    }
    console.log(`${blockchain.name} 提供服务`);
    const fastNode = blockchainNodeService.getFastNode(blockchain);
    return getDefaultProvider(fastNode.network, fastNode.networkOptions);
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
