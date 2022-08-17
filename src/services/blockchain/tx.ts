import { makeAutoObservable } from 'mobx';

/**
 * 钱包交易服务
 */
class TxService {
  loading = false;

  constructor() {
    makeAutoObservable(this, undefined, {
      autoBind: true,
    });
  }
}

export const txService = new TxService();
