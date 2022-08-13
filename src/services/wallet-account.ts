import { makeResettable } from '../mobx/mobx-reset';
import { makeAutoObservable } from 'mobx';

/**
 * 钱包账户服务
 */
export class WalletAccountService {
  loading = false;

  /**
   * 当前选择的帐户
   */
  selectIndex = -1;

  constructor() {
    makeResettable(this);
    makeAutoObservable(this, undefined, {
      autoBind: true,
    });
  }
}

export const walletAccountService = new WalletAccountService();
