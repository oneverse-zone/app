import { makeAutoObservable } from 'mobx';
import { TransactionOptions } from './api';
import { accountAdapter } from './account-adapter';
import { goBack } from '../../core/navigation';
import { Toast } from 'native-base';
import { lang } from '../../locales';
import { securityService } from '../security';
import { Mnemonic } from '../../entity/blockchain/wallet';
import { walletManagerService } from './wallet-manager';

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

  async send(options: Omit<TransactionOptions, 'mnemonic' | 'password' | 'secretKey'>) {
    if (this.loading) {
      return;
    }
    this.loading = true;
    try {
      const { selected } = walletManagerService;
      if (!selected) {
        return;
      }

      const secretKey = await securityService.decrypt<Mnemonic | string>(selected.secretKey);
      let keyOptions: any = {};
      if (typeof secretKey === 'string') {
        keyOptions = {
          secretKey,
        };
      } else {
        keyOptions = {
          ...secretKey,
        };
      }

      await accountAdapter().sendTransaction({
        ...options,
        ...keyOptions,
      });
      Toast.show({
        title: lang('token.send.pended'),
      });
      // go back transfer
      goBack();
      // go back token
      goBack();
    } catch (e) {
      console.error(`交易失败`, e);
      Toast.show({
        title: lang('token.send.failure'),
      });
    } finally {
      this.loading = false;
    }
  }
}

export const txService = new TxService();
