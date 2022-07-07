import AsyncStorage from '@react-native-async-storage/async-storage';
import { XChaCha20Poly1305 } from '@stablelib/xchacha20poly1305';
import { decodeCleartext, prepareCleartext } from 'dag-jose-utils';
import { randomBytes } from '@stablelib/random';
import * as u8a from 'uint8arrays';

const key = {
  /**
   * 助记词
   */
  mnemonic: 'MNEMONIC',
  /**
   * 账户助记词备份状态
   */
  mnemonicBackupStatus: 'MNEMONIC_BACKUP_STATUS',

  language: 'language',
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

  findLanguage() {
    return AsyncStorage.getItem(key.language);
  }

  async saveLanguage(language: string) {
    await AsyncStorage.setItem(key.language, language);
  }

  /**
   * 账户助记词
   * @param decrypt 是否需要解密 默认false
   */
  async findMnemonic(decrypt?: boolean): Promise<{ mnemonic: string; password?: string } | string | null> {
    let mnemonic = await AsyncStorage.getItem(key.mnemonic);
    if (mnemonic && decrypt) {
      return await this.decrypt(mnemonic);
    }
    return mnemonic;
  }

  /**
   * 保存助记词
   * @param mnemonic password
   * @param password 助记词密码
   */
  async saveMnemonic(mnemonic: string, password?: string) {
    const data = await this.encrypt({ mnemonic, password });
    await AsyncStorage.setItem(key.mnemonic, data);
  }

  /**
   * 获取助记词备份状态
   */
  async findMnemonicBackupStatus() {
    return await AsyncStorage.getItem(key.mnemonicBackupStatus);
  }

  /**
   * 更新助记词备份状态
   */
  async updateMnemonicBackupStatus(status: string) {
    await AsyncStorage.setItem(key.mnemonicBackupStatus, status);
  }

  async clearAll() {
    await AsyncStorage.clear();
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
