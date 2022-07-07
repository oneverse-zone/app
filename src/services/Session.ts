import { action, makeAutoObservable, observable } from 'mobx';
import { toUtf8Bytes, UnicodeNormalizationForm } from '@ethersproject/strings';
import { scrypt } from 'scrypt-js';
import * as Keychain from 'react-native-keychain';

import { DIDService } from '@oneverse/identify';
import { randomMnemonic } from '@oneverse/utils';

import { ceramicApi } from '../constants/Url';
import { repository } from './Repository';
import { resetTo } from '../core/navigation';
import { route } from '../container/router';

/**
 * N - The CPU/memory cost; increasing this increases the overall difficulty
 */
const N = 8192;
/**
 * r - The block size; increasing this increases the dependency on memory latency and bandwidth
 */
const r = 8;
/**
 * p - The parallelization cost; increasing this increases the dependency on multi-processing
 */
const p = 4;

export class Session {
  didService: DIDService | undefined;

  /**
   * 账户助记词
   */
  mnemonic: string | undefined;

  @observable
  loading: boolean = false;

  @observable
  loadingText: string = '';

  @observable
  id: string | undefined = '';

  /**
   * 设备是否锁定
   * 默认为锁定状态
   * 锁定状态必须输入pin密码才能进入app
   */
  @observable
  locked: boolean = true;

  constructor() {
    makeAutoObservable(this, undefined, {
      autoBind: true,
    });
  }

  async initialize() {
    return !!(await repository.findMnemonic());
  }

  /**
   * 用户是否登录
   * 或者解锁
   */
  get authenticated(): boolean {
    return this.didService?.did?.authenticated || false;
  }

  /**
   * 解锁设备
   * @param pinCode pinCode
   */
  @action
  async unlock(pinCode: string) {
    if (this.loading) return;
    this.loading = true;
    try {
      this.locked = false;
      const pwd = toUtf8Bytes(pinCode, UnicodeNormalizationForm.NFKD);
      const salt = toUtf8Bytes('pin-code', UnicodeNormalizationForm.NFKD);
      // 初始化设备密钥
      // 设备密钥 用于加密用户设备上的数据
      const key = await scrypt(pwd, salt, N, r, p, 32);
      repository.initCipher(key);
      const mnemonic: any = await repository.findMnemonic(true);
      mnemonic && (await this.login(mnemonic));
    } finally {
      this.loading = false;
    }
  }

  /**
   * 注册去中心化身份并自动登录
   */
  @action
  async registerAndLogin(password: string, mnemonicLength: number, mnemonicPassword?: string) {
    if (this.loading) {
      return;
    }
    this.loading = true;
    try {
      const result = await Keychain.setGenericPassword('oneverse', password);
      console.log('generic', result);
      await this.initDevicePassword(password);

      const mnemonic = randomMnemonic();
      await this.login({ mnemonic, password: mnemonicPassword });
      await repository.saveMnemonic(mnemonic, mnemonicPassword);
      // 更新助记词备份状态
      await repository.updateMnemonicBackupStatus('');
    } finally {
      this.loading = false;
    }
  }

  /**
   * 登录
   * @param mnemonic 助记词
   * @param password 密码
   */
  @action
  async login({ mnemonic, password }: { mnemonic: string; password?: string }) {
    try {
      this.didService = await DIDService.newInstance({
        ceramicApi,
        mnemonic,
        password,
      });
      this.id = this.didService.did.id.toString();
    } catch (e: any) {
      console.warn('登录失败', e.message);
      if (e.message === 'ChaCha20Poly1305 needs 32-byte key') {
      }
      throw e;
    }
  }

  @action
  async logout() {
    await repository.clearAll();
    this.locked = true;
    resetTo(route.Start);
  }

  /**
   * 初始化设备密码
   * @param password 设备密码
   * @private 内部调用
   */
  private async initDevicePassword(password: string) {
    const pwd = toUtf8Bytes(password, UnicodeNormalizationForm.NFKD);
    const salt = toUtf8Bytes('device-password', UnicodeNormalizationForm.NFKD);
    // 初始化设备密钥
    // 设备密钥 用于加密用户设备上的数据
    const key = await scrypt(pwd, salt, N, r, p, 32);
    repository.initCipher(key);
  }
}

export const sessionService = new Session();
