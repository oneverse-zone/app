import {action, makeAutoObservable, observable} from 'mobx';
import {DIDService} from '@oneverse/identify/lib/services/DIDService';
import {randomMnemonic} from '@oneverse/identify/lib/utils/mnemonic';
import {ceramicApi} from '../constants/Url';

export class Session {
  didService: DIDService | undefined;

  @observable
  loading: boolean = false;

  @observable
  id: string | undefined = '';

  constructor() {
    makeAutoObservable(this, undefined, {
      autoBind: true,
    });
  }

  /**
   * 用户是否登录
   */
  authenticate(): boolean {
    return this.didService?.did?.authenticated || false;
  }

  @action
  async registerAndLogin(password: string) {
    if (this.loading) {
      return;
    }
    this.loading = true;
    try {
      const mnemonic = randomMnemonic();
      this.didService = await DIDService.newInstance({
        ceramicApi,
        mnemonic,
        password,
      });
      this.id = this.didService.did?.id.toString();
      return mnemonic;
    } finally {
      this.loading = false;
    }
  }

  @action
  async login(mnemonic: string, password?: string) {
    if (this.loading) {
      return;
    }
    this.loading = true;
    try {
      this.didService = await DIDService.newInstance({
        ceramicApi,
        mnemonic,
        password,
      });
      this.id = this.didService.did.id.toString();
    } catch (e: any) {
      if (e.message === 'ChaCha20Poly1305 needs 32-byte key') {
      }
      throw e;
    } finally {
      this.loading = false;
    }
  }
}

export const sessionService = new Session();
