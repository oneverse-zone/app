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
import { makeResettable, resetState } from '../mobx/mobx-reset';
import { passwordService } from './password';
import { securityService } from './security';

export class Session {
  didService: DIDService | undefined;

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
    makeResettable(this);
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
      const ok = await passwordService.verify(pwd);
      if (!ok) {
        throw new Error('密码不正确');
      }
      await securityService.initCipher(pwd);
      let mnemonic: any = await repository.findMnemonic();
      mnemonic = await securityService.decrypt(mnemonic);
      if (mnemonic) {
        console.log('设备解锁成功,初始化身份信息');
        await this.initDID(mnemonic);
        this.locked = false;
      }
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
      const mnemonicStr = randomMnemonic(mnemonicLength === 24 ? 32 : 16);
      const mnemonic = { mnemonic: mnemonicStr, password: mnemonicPassword };
      await this.handleRegisterAndLogin(password, mnemonic);
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
      await this.handleRegisterAndLogin(password, { mnemonic, password: mnemonicPassword });
    } catch (e) {
      console.error('身份导入失败', e);
      throw e;
    } finally {
      this.loading = false;
    }
  }

  @action
  async clearDevice() {
    if (this.loading) {
      return;
    }
    this.loading = true;
    try {
      await repository.clearAll();
      await Keychain.resetGenericPassword();
      this.locked = true;
      resetTo(route.Start);
      resetState();
      Toast.show({
        title: lang('identify.delete.success'),
      });
    } finally {
      this.loading = false;
    }
  }

  private async handleRegisterAndLogin(password: string, mnemonic: { mnemonic: string; password?: string }) {
    console.log(`开始初始化DID身份`);
    await this.initDID(mnemonic);

    await Promise.all([
      // 设备密码初始化
      passwordService.setPassword(password),
      // 更新助记词备份状态
      repository.updateMnemonicBackupStatus(''),
      // 初始化秘钥模块
      securityService.initCipher(password),
    ]);
    // 加密助记词
    const mnemonicStr = await securityService.encrypt(mnemonic);
    // 保存助记词
    await repository.saveMnemonic(mnemonicStr);
  }

  /**
   * 登录
   * @param mnemonic 助记词
   * @param password 密码
   */
  private async initDID({ mnemonic, password }: { mnemonic: string; password?: string }) {
    try {
      this.didService = await DIDService.newInstance({
        ceramicApi,
        mnemonic,
        password,
      });
      this.id = this.didService.did.id.toString();
      console.log(`DID身份初始化成功: ${this.id}`);
    } catch (e: any) {
      console.warn('DID身份初始化失败', e.message);
      if (e.message === 'ChaCha20Poly1305 needs 32-byte key') {
      }
      throw e;
    }
  }
}

export const sessionService = new Session();
