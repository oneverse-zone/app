import { XChaCha20Poly1305 } from '@stablelib/xchacha20poly1305';
import { decodeCleartext, prepareCleartext } from 'dag-jose-utils';
import { randomBytes } from '@stablelib/random';
import * as u8a from 'uint8arrays';

/**
 * 安全服务
 */
class SecurityService {
  cipher?: XChaCha20Poly1305 | undefined;

  /**
   * 初始化cipher
   */
  initCipher(key: Uint8Array) {
    this.cipher = new XChaCha20Poly1305(key);
  }

  /**
   * 对数据进行加密
   * @param plaintext 明文数据
   * @private 内部使用
   */
  async encrypt(plaintext: any): Promise<string> {
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
  async decrypt<T>(ciphertext: string): Promise<T> {
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

export const securityService = new SecurityService();
