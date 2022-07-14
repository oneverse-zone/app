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
import { Toast } from 'native-base';
import { lang } from '../locales';
import { walletService } from './Wallet';

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
   * @param pwd pinCode
   */
  @action
  async unlock(pwd: string) {
    if (this.loading) return;
    this.loading = true;
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials && credentials.password !== pwd) {
        throw new Error('密码不正确');
      }

      this.locked = false;
      await this.initDevicePassword(pwd);
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
      const mnemonic = randomMnemonic(mnemonicLength === 24 ? 32 : 16);
      await this.handleIdentifyInit(password, mnemonic, mnemonicPassword);
      // 更新助记词备份状态
      await repository.updateMnemonicBackupStatus('');
    } catch (e) {
      console.error('身份注册失败', e);
      throw e;
    } finally {
      this.loading = false;
    }
  }

  /**
   * 导入去中心化身份
   */
  @action
  async importAndLogin(password: string, mnemonic: string, mnemonicPassword?: string) {
    if (this.loading) {
      return;
    }
    this.loading = true;
    try {
      await this.handleIdentifyInit(password, mnemonic, mnemonicPassword);
    } catch (e) {
      console.error('身份导入失败', e);
      throw e;
    } finally {
      this.loading = false;
    }
  }

  /**
   * 处理账户处始化功能
   * 并自动登录
   * @private
   */
  private async handleIdentifyInit(password: string, mnemonic: string, mnemonicPassword?: string) {
    await this.login({ mnemonic, password: mnemonicPassword });
    console.log(`DID 身份登录成功`);
    // 登录成功 初始化钱包
    await walletService.initHDWallet(mnemonic, mnemonicPassword);
    await Keychain.setGenericPassword('oneverse', password);
    await this.initDevicePassword(password);
    await repository.saveMnemonic(mnemonic, mnemonicPassword);
  }

  /**
   * 登录
   * @param mnemonic 助记词
   * @param password 密码
   */
  private async login({ mnemonic, password }: { mnemonic: string; password?: string }) {
    try {
      this.didService = await DIDService.newInstance({
        ceramicApi,
        mnemonic,
        password,
      });
      this.id = this.didService.did.id.toString();
      await walletService.initHDWallet(mnemonic, password);
    } catch (e: any) {
      console.warn('登录失败', e.message);
      if (e.message === 'ChaCha20Poly1305 needs 32-byte key') {
      }
      throw e;
    }
  }

  @action
  async logout() {
    if (this.loading) {
      return;
    }
    this.loading = true;
    try {
      await repository.clearAll();
      await Keychain.resetGenericPassword();
      this.locked = true;
      resetTo(route.Start);
      Toast.show({
        title: lang('identify.delete.success'),
      });
    } finally {
      this.loading = false;
    }
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
