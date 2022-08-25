import {
  BaseProvider,
  CreateWalletAccountOptions,
  CustomGasFeeInfoOptions,
  TransactionOptions,
  WalletProvider,
} from '../api';
import { formatEther, formatUnits, parseEther, parseUnits } from '@ethersproject/units';
import { isAddress } from '@ethersproject/address';
import { Signer, VoidSigner } from '@ethersproject/abstract-signer';
import { Wallet as BlockchainWallet } from '@ethersproject/wallet';
import { HDNode } from '@ethersproject/hdnode';
import { getDefaultProvider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';
import { BigNumber, BigNumberish } from '@ethersproject/bignumber';

import { walletAdapter } from '../adapter';
import { AbstractProvider } from './abstract-provider';
import { AccountToken, WalletAccount } from '../../../entity/blockchain/wallet-account';
import { blockchainNodeService } from '../blockchain-node';
import { TokenType } from '../../../entity/blockchain/token';
import { ethereum, ethereumGoerli, ethereumRinkeby } from '../chainlist/ethereum';
import { GasGear, GasInfo } from '../../../entity/blockchain/gas';

// The minimum ABI to get ERC20 Token balance
import ERC20_BASE_ABI from './erc20-base-abi.json';
import { BaseToken } from '../../../entity/blockchain/coin';

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
  blockchainId;
  coinId;

  protected constructor(blockchainId: string, coinId: number) {
    super();
    this.blockchainId = blockchainId;
    this.coinId = coinId;
  }

  isAddress(address: string): boolean {
    return isAddress(address);
  }

  gasPriceUnit(): string {
    return GAS_PRICE_UNIT.toUpperCase();
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
    const provider = this.getProvider();
    let balance;
    if (token.type === TokenType.COIN) {
      const balanceWei = await provider.getBalance(account.address);
      balance = balanceWei.toString();
    } else {
      const contract = new Contract(token.token.address, ERC20_BASE_ABI, provider);
      balance = await contract.balanceOf(account.address);
    }
    console.log(`address=${account.address} type=${token.type} token=${token.token.address} balance=${balance}`);
    return balance;
  }

  async getBalanceUI(account: WalletAccount, token: AccountToken): Promise<string> {
    const balance = await this.getBalance(account, token);
    return Number.parseFloat(formatUnits(balance, token.token.decimals)).toFixed(UI_MAIN_UNIT_DECIMALS);
  }

  async estimateGas(account: WalletAccount, transaction: any): Promise<string> {
    const provider = this.getProvider();
    const signer = new VoidSigner(account.address, provider);
    const value = await signer.estimateGas(transaction);
    return value.toString();
  }

  async getGasPrice(): Promise<string> {
    const provider = this.getProvider();
    const gasPrice = await provider.getGasPrice();
    return formatUnits(gasPrice, this.gasPriceUnit());
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
  async getGasFeeInfos(gasLimit: string | bigint | number): Promise<Array<GasInfo>> {
    const provider = this.getProvider();
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

  async customGasFeeInfo(options: CustomGasFeeInfoOptions): Promise<GasInfo> {
    const provider = this.getProvider();
    const feeData = await provider.getFeeData();

    const { lastBaseFeePerGas } = feeData;
    if (!lastBaseFeePerGas) {
      throw new Error('无法获取链上数据');
    }

    const maxPriorityFeePerGas = parseUnits(options.maxPriorityFeePerGas, GAS_PRICE_UNIT);
    const maxFeePerGas = parseUnits(options.maxFeePerGas, GAS_PRICE_UNIT);

    const minGasFee = lastBaseFeePerGas.add(maxPriorityFeePerGas).mul(options.gasLimit);
    const maxGasFee = maxFeePerGas.mul(options.gasLimit);

    return formatGasInfo({
      lastBaseFeePerGas: lastBaseFeePerGas,
      maxPriorityFeePerGas,
      maxFeePerGas,

      gasLimit: options.gasLimit,

      minGasFee,
      maxGasFee,

      gear: GasGear.CUSTOM,
      // 30s
      time: 30,
    });
  }

  async getTokenInfo(address: string): Promise<BaseToken | undefined> {
    console.log(`获取合约信息[${address}]`);
    const provider = this.getProvider();
    const contract = new Contract(address, ERC20_BASE_ABI, provider);
    try {
      const values = await Promise.all([contract.name(), contract.symbol(), contract.decimals()]);
      return {
        name: values[0],
        symbol: values[1],
        decimals: values[2] ?? 0,
      };
    } catch (e) {
      console.error(`获取合约信息失败: ${address}`, e);
      return undefined;
    }
  }

  async sendTransaction({
    account,
    token,
    secretKey,
    mnemonic,
    password,
    to,
    data,
    value,
    gasInfo,
  }: TransactionOptions): Promise<any> {
    if (!secretKey && !mnemonic) {
      throw new Error('助记词和密码必须传递一个');
    }

    let wallet: BlockchainWallet | undefined = undefined;
    if (secretKey) {
      wallet = new BlockchainWallet(secretKey);
    } else if (mnemonic) {
      const { coinId, accountIndex, changeIndex, addressIndex } = account;
      const derivePath = `m/44'/${coinId}'/${accountIndex}'/${changeIndex}/${addressIndex}`;
      wallet = new BlockchainWallet(HDNode.fromMnemonic(mnemonic, password).derivePath(derivePath));
    }

    if (!wallet) {
      throw new Error('');
    }
    const provider = this.getProvider();
    wallet = wallet.connect(provider);

    if (token.type === TokenType.COIN) {
      const res = await wallet.sendTransaction({
        to,
        from: account.address,
        gasLimit: gasInfo.gasLimit,
        data,
        value: parseEther(`${value}`),

        maxPriorityFeePerGas: gasInfo.maxPriorityFeePerGas,
        maxFeePerGas: gasInfo.maxFeePerGas,
      });
      console.log('交易上链成功', res);
    } else if (token.type === TokenType.ERC20) {
      const contract = new Contract(token.token.address, ERC20_BASE_ABI, wallet as any);
      const res = await contract.transfer(to, parseUnits(`${value}`, token.token.decimals), {
        // maxPriorityFeePerGas: gasInfo.maxPriorityFeePerGas,
        // maxFeePerGas: gasInfo.maxFeePerGas,
        // gasLimit: gasInfo.gasLimit,
      });
      console.log(`ERC20交易上链成功`, res);
    }
  }

  protected getProvider() {
    const blockchain = this.findBlockchainById(this.blockchainId);
    if (null == blockchain) {
      throw new Error(`不支持的链: ${this.blockchainId}`);
    }
    const fastNode = blockchainNodeService.getFastNode(blockchain);
    console.log(`${blockchain.name} ${fastNode.name} 提供服务`);
    return getDefaultProvider(fastNode.network, fastNode.networkOptions);
  }
}

/**
 * 以太坊钱包提供者
 */
export class EthereumWalletProvider extends BaseEthereumWalletProvider implements BaseProvider {
  constructor(blockchainId: string) {
    super(blockchainId, ethereum.coinId);
  }

  support(blockchainId: string, coinId: number): boolean | Promise<boolean> {
    return blockchainId === this.blockchainId;
  }

  isEthereum(): boolean {
    return true;
  }
}

walletAdapter.register(new EthereumWalletProvider(ethereum.id));
walletAdapter.register(new EthereumWalletProvider(ethereumRinkeby.id));
walletAdapter.register(new EthereumWalletProvider(ethereumGoerli.id));
