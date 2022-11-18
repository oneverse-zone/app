import {
  BaseProvider,
  CreateWalletAccountOptions,
  CustomGasFeeInfoOptions,
  EstimateGasOptions,
  TransactionOptions,
  WalletProvider,
} from '../api';
import { formatEther, formatUnits, parseEther, parseUnits } from '@ethersproject/units';
import { isAddress } from '@ethersproject/address';
import { VoidSigner } from '@ethersproject/abstract-signer';
import { Wallet as BlockchainWallet } from '@ethersproject/wallet';
import { HDNode } from '@ethersproject/hdnode';
import { getDefaultProvider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';
import { walletAdapter } from '../adapter';
import { AbstractProvider } from './abstract-provider';
import { WalletAccount } from '../../../entity/blockchain/wallet-account';
import { blockchainNodeService } from '../blockchain-node';
import { Token, TokenType } from '../../../entity/blockchain/token';
import { ethereum, ethereumGoerli, ethereumRinkeby } from '../chainlist/ethereum';
import { GasGear, GasInfo } from '../../../entity/blockchain/gas';

// The minimum ABI to get ERC20 Token balance
import ERC20_BASE_ABI from './erc20-base-abi.json';
import { BaseToken } from '../../../entity/blockchain/coin';
import { add, mul, toDecimal } from '../../../utils/calculator';

const UI_MAIN_UNIT_DECIMALS = 8;
const GAS_PRICE_UNIT = 'gwei';

function createFormatGasInfo({
  lastBaseFeePerGas,
  maxPriorityFeePerGas,
  gasLimit,
  gear,
  time,
}: {
  lastBaseFeePerGas: any;
  maxPriorityFeePerGas: any;
  gasLimit: GasInfo['gasLimit'];
  gear: GasInfo['gear'];
  time: GasInfo['time'];
}): GasInfo {
  const baseFeePerGasDouble = mul(lastBaseFeePerGas, 2);

  const minFeePerGas = add(lastBaseFeePerGas, maxPriorityFeePerGas);
  const maxFeePerGas = add(baseFeePerGasDouble, maxPriorityFeePerGas);

  const minGasFee = mul(minFeePerGas, gasLimit);
  const maxGasFee = mul(maxFeePerGas, gasLimit);

  return formatGasInfo({
    lastBaseFeePerGas,
    maxPriorityFeePerGas,
    maxFeePerGas,
    gasLimit,
    minGasFee,
    maxGasFee,
    gear,
    time,
  });
}

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
  [key: string]: any;
}): GasInfo {
  return {
    lastBaseFeePerGas: lastBaseFeePerGas.toString(),
    maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
    maxPriorityFeePerGasUI: formatUnits(maxPriorityFeePerGas.toString(), GAS_PRICE_UNIT),

    maxFeePerGas: maxFeePerGas.toString(),
    maxFeePerGasUI: formatUnits(maxFeePerGas.toString(), GAS_PRICE_UNIT),

    gasLimit: gasLimit.toString(),

    minGasFee: minGasFee.toString(),
    minGasFeeUI: Number.parseFloat(formatEther(minGasFee.toString())).toFixed(UI_MAIN_UNIT_DECIMALS),

    maxGasFee: maxGasFee.toString(),
    maxGasFeeUI: Number.parseFloat(formatEther(maxGasFee.toString())).toFixed(UI_MAIN_UNIT_DECIMALS),

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

  async getBalance(account: WalletAccount, token: Token): Promise<string> {
    const provider = this.getProvider();
    let balance;
    if (token.type === TokenType.COIN) {
      const balanceWei = await provider.getBalance(account.address);
      balance = balanceWei.toString();
    } else {
      const contract = new Contract(token.address ?? '', ERC20_BASE_ABI, provider);
      balance = await contract.balanceOf(account.address);
    }
    console.log(`address=${account.address} type=${token.type} token=${token.address} balance=${balance}`);
    return balance;
  }

  async getBalanceUI(account: WalletAccount, token: Token): Promise<string> {
    const balance = await this.getBalance(account, token);
    return Number.parseFloat(formatUnits(balance, token.decimals)).toFixed(UI_MAIN_UNIT_DECIMALS);
  }

  async estimateGas(
    account: WalletAccount,
    token: Token,
    { params = [], method = 'transfer' }: EstimateGasOptions,
  ): Promise<string> {
    const provider = this.getProvider();
    const signer = new VoidSigner(account.address, provider);

    if (token.type === TokenType.COIN) {
      const value = await signer.estimateGas(params[0] || {});
      return value.toString();
    } else if (token.type === TokenType.ERC20) {
      const contract = new Contract(token.address ?? '', ERC20_BASE_ABI, signer as any);
      const value = await contract.estimateGas[method](...params);
      console.log(`合约预估gas: [${token.address}] [${method}] [${value}]`, params);
      return value.toString();
    }
    return '0';
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
   *
   * @param estimateGas 预估的gas
   * @param multiplier
   */
  async getGasFeeInfos(estimateGas: string | bigint | number, multiplier = 1.5): Promise<Array<GasInfo>> {
    const provider = this.getProvider();
    const block = await provider.getBlock('latest');
    if (!block) {
      return [];
    }
    const lastBaseFeePerGas = block.baseFeePerGas;
    if (!lastBaseFeePerGas) {
      return [];
    }
    const initialGasLimit = toDecimal(estimateGas);
    const lastGasLimit = block.gasLimit;
    const upperGasLimit = mul(lastGasLimit, 0.9);
    const bufferedGasLimit = mul(initialGasLimit, multiplier);

    let gasLimit;
    if (initialGasLimit.gt(upperGasLimit)) {
      gasLimit = initialGasLimit;
    } else if (bufferedGasLimit.lt(upperGasLimit)) {
      gasLimit = bufferedGasLimit.toFixed(0);
    } else {
      gasLimit = upperGasLimit;
    }
    console.log(
      `estimateGas=[${estimateGas}] blockGasLimit=${lastGasLimit} upperGasLimit=${upperGasLimit} bufferedGasLimit=${bufferedGasLimit} gasLimit=${gasLimit}`,
    );
    let gasLimitStr = gasLimit.toString();

    const low: GasInfo = createFormatGasInfo({
      lastBaseFeePerGas: lastBaseFeePerGas,
      maxPriorityFeePerGas: 1470000000,

      gasLimit: gasLimitStr,

      gear: GasGear.LOW,
      // 10 分钟
      time: 10 * 60,
    });

    const fast: GasInfo = createFormatGasInfo({
      lastBaseFeePerGas: lastBaseFeePerGas,
      maxPriorityFeePerGas: 2000000000,

      gasLimit: gasLimitStr,

      gear: GasGear.FAST,
      // 30s
      time: 30,
    });

    const standard: GasInfo = createFormatGasInfo({
      lastBaseFeePerGas: lastBaseFeePerGas,
      maxPriorityFeePerGas: 1500000000,

      gasLimit: gasLimitStr,

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

    const minGasFee = mul(add(lastBaseFeePerGas, maxPriorityFeePerGas), options.gasLimit);
    const maxGasFee = mul(maxFeePerGas, options.gasLimit);

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

    if (token.token.type === TokenType.COIN) {
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
    } else if (token.token.type === TokenType.ERC20) {
      const contract = new Contract(token.token.address ?? '', ERC20_BASE_ABI, wallet as any);
      const res = await contract.transfer(to, parseUnits(`${value}`, token.token.decimals), {
        maxPriorityFeePerGas: gasInfo.maxPriorityFeePerGas,
        maxFeePerGas: gasInfo.maxFeePerGas,
        gasLimit: gasInfo.gasLimit,
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
