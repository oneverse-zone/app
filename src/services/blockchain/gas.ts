import { makeAutoObservable } from 'mobx';
import { GasGear, GasInfo } from '../../entity/blockchain/gas';
import { walletManagerService } from './wallet-manager';
import { CustomGasFeeInfoOptions } from './api';
import { goBack } from '../../core/navigation';
import { accountAdapter } from './account-adapter';

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
  customGasInfo: Record<string, GasInfo> = {};

  /**
   * 用户选择的gas档位
   */
  selectedGasInfoIndex = 1;

  gasLimit: bigint | string | number = 21000;

  constructor() {
    makeAutoObservable(this, undefined, {
      autoBind: true,
    });
  }

  /**
   * 更新档位信息
   */
  async update() {
    if (this.loading) {
      return;
    }
    if (this.selectedGasInfoIndex === -1) {
      return;
    }
    this.loading = true;
    try {
      const { selectedAccount } = walletManagerService;
      if (!selectedAccount) {
        return;
      }
      this._gasInfos[selectedAccount.blockchainId] = await accountAdapter().getGasFeeInfos(this.gasLimit);
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
    if (this.selectedGasInfoIndex === -1) {
      return this.customGasInfo[selectedAccount.blockchainId] || DEFAULT_GAS_INFO;
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
    return accountAdapter().gasPriceUnit();
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

  async addCustom(param: CustomGasFeeInfoOptions) {
    if (this.loading) {
      return;
    }
    this.loading = true;
    try {
      const { selectedAccount } = walletManagerService;
      if (!selectedAccount) {
        return;
      }

      this.customGasInfo[selectedAccount.blockchainId] = await accountAdapter().customGasFeeInfo(param);
      this.selectedGasInfoIndex = -1;
      goBack();
    } finally {
      this.loading = false;
    }
  }
}

export const gasService = new GasService();
