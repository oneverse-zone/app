import AsyncStorage from '@react-native-community/async-storage';
import { XChaCha20Poly1305 } from '@stablelib/xchacha20poly1305';
import { decodeCleartext, prepareCleartext } from 'dag-jose-utils';
import { randomBytes } from '@stablelib/random';
import * as u8a from 'uint8arrays';

const key = {
  /**
   * 账户助记词
   */
  accountMnemonic: 'ACCOUNT_MNEMONIC',
  /**
   * 账户助记词备份状态
   */
  accountMnemonicBackupStatus: 'ACCOUNT_MNEMONIC_BACKUP_STATUS',
};

/**
 * 数据仓库服务
 */
class Repository {
  cipher?: XChaCha20Poly1305 | undefined;

  /**
   * 初始化cipher
   */
  initCipher(key: Uint8Array) {
    this.cipher = new XChaCha20Poly1305(key);
  }

  /**
   * 账户助记词
   */
  async findAccountMnemonic(): Promise<string | undefined> {
    let mnemonic = await AsyncStorage.getItem(key.accountMnemonic);
    return mnemonic ? await this.decrypt(mnemonic) : undefined;
  }

  /**
   * 保存助记词
   * @param mnemonic 助记词
   */
  async saveAccountMnemonic(mnemonic: string) {
    const data = await this.encrypt(mnemonic);
    await AsyncStorage.setItem(key.accountMnemonic, data);
  }

  /**
   * 获取助记词备份状态
   */
  async findAccountMnemonicBackupStatus() {
    return await AsyncStorage.getItem(key.accountMnemonicBackupStatus);
  }

  /**
   * 更新助记词备份状态
   */
  async updateAccountMnemonicBackupStatus(status: string) {
    await AsyncStorage.setItem(key.accountMnemonicBackupStatus, status);
  }

  /**
   * 对数据进行加密
   * @param plaintext 明文数据
   * @private 内部使用
   */
  private async encrypt(plaintext: any): Promise<string> {
    if (!this.cipher) {
      throw new Error('加密模块未初始化');
    }
    const preparedCleartext = await prepareCleartext(plaintext);
    const iv = randomBytes(this.cipher.nonceLength);

    const sealed = this.cipher.seal(iv, preparedCleartext);
    return JSON.stringify({
      sealed: u8a.toString(sealed, 'base64pad'),
      iv: u8a.toString(iv, 'base64pad'),
    });
  }

  /**
   * 对数据进行解密
   * @param ciphertext 密文 this.encrypt 加密结果
   * @private 内部使用
   */
  private async decrypt<T>(ciphertext: string): Promise<T> {
    if (!this.cipher) {
      throw new Error('加密模块未初始化');
    }
    const data = JSON.parse(ciphertext);
    const iv = u8a.fromString(data.iv, 'base64pad');
    const sealed = u8a.fromString(data.sealed, 'base64pad');
    const plaintext = this.cipher.open(iv, sealed);
    if (!plaintext) {
      throw new Error('解密失败');
    }
    return decodeCleartext(plaintext) as T;
  }
}

export const repository = new Repository();
