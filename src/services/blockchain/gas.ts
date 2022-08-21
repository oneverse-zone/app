import { makeAutoObservable } from 'mobx';
import { GasGear, GasInfo } from '../../entity/blockchain/gas';
import { WalletAccount } from '../../entity/blockchain/wallet-account';
import { walletAdapter } from './adapter';
import { walletManagerService } from './wallet-manager';

export const DEFAULT_GAS_INFO: GasInfo = {
  gasLimit: 0,
  gear: GasGear.CUSTOM,
  lastBaseFeePerGas: 0,
  maxFeePerGas: 0,
  maxFeePerGasUI: 0,
  maxGasFee: 0,
  maxGasFeeUI: 0,
  maxPriorityFeePerGas: 0,
  maxPriorityFeePerGasUI: 0,
  minGasFee: 0,
  minGasFeeUI: 0,
  time: 0,
};

class GasService {
  loading = false;

  /**
   * gas信息
   * key 链id
   * value gas 档位信息
   */
  private _gasInfos: Record<string, Array<GasInfo>> = {};

  /**
   * 用户选择的gas档位
   */
  selectedGasInfoIndex = 1;

  constructor() {
    makeAutoObservable(this, undefined, {
      autoBind: true,
    });
  }

  /**
   * 更新档位信息
   */
  async update(gasLimit: bigint | string | number) {
    if (this.loading) {
      return;
    }
    this.loading = true;
    try {
      const { selectedAccount } = walletManagerService;
      if (!selectedAccount) {
        return;
      }
      this._gasInfos[selectedAccount.blockchainId] = await walletAdapter.getGasFeeInfos(selectedAccount, gasLimit);
    } finally {
      this.loading = false;
    }
  }

  /**
   * 当前选择的gas信息
   */
  get selected(): GasInfo {
    const { selectedAccount } = walletManagerService;
    if (!selectedAccount) {
      return DEFAULT_GAS_INFO;
    }

    const gasInfos = this._gasInfos[selectedAccount.blockchainId] ?? [];
    return gasInfos[this.selectedGasInfoIndex] || DEFAULT_GAS_INFO;
  }

  /**
   * 当前选择账户的GAS PRICE单位
   */
  get gasPriceUnit(): string {
    const { selectedAccount } = walletManagerService;
    if (!selectedAccount) {
      return '';
    }
    return walletAdapter.gasPriceUnit(selectedAccount);
  }

  get gasInfos(): Array<GasInfo> {
    const { selectedAccount } = walletManagerService;
    if (!selectedAccount) {
      return [];
    }
    return this._gasInfos[selectedAccount.blockchainId] ?? [];
  }

  select(index: number) {
    this.selectedGasInfoIndex = index;
  }
}

export const gasService = new GasService();
