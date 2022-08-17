import { XChaCha20Poly1305 } from '@stablelib/xchacha20poly1305';
import { decodeCleartext, prepareCleartext } from 'dag-jose-utils';
import { randomBytes } from '@stablelib/random';
import * as u8a from 'uint8arrays';
import { repository } from './Repository';
import { toUtf8Bytes, UnicodeNormalizationForm } from '@ethersproject/strings';
import { scrypt } from 'scrypt-js';

const storageKey = 'bPeKmrMj09lXTnxpJuGw6pO9FO3khiMX';

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

/**
 * 安全服务
 */
export class SecurityService {
  cipher?: XChaCha20Poly1305 | undefined;

  /**
   * 初始化cipher
   */
  async initCipher(password: string) {
    const key = await SecurityService.toKey(password);
    let randomKeyStr: string | null = await repository.get(storageKey);
    let randomKey: Uint8Array;

    const cipher = new XChaCha20Poly1305(key);
    if (randomKeyStr) {
      try {
        randomKey = await SecurityService.decrypt(cipher, randomKeyStr);
      } catch (e) {
        console.log(`输入的秘钥不正确，无法初始化秘钥`);
        throw e;
      }
    } else {
      // 生成随机秘钥
      randomKey = randomBytes(32);
      // 用用户输入的秘钥进行加密
      randomKeyStr = await SecurityService.encrypt(cipher, randomKey);
      // 把随机秘钥进行保存
      await repository.set(storageKey, randomKeyStr);
    }

    this.cipher = new XChaCha20Poly1305(randomKey);
  }

  async encrypt(plaintext: any) {
    if (!this.cipher) {
      throw new Error('加密模块未初始化');
    }
    const preparedCleartext = await prepareCleartext(plaintext);
    return SecurityService.encrypt(this.cipher, preparedCleartext);
  }

  async decrypt<T>(ciphertext: string): Promise<T | null> {
    if (!this.cipher) {
      throw new Error('加密模块未初始化');
    }
    const plaintext = await SecurityService.decrypt(this.cipher, ciphertext);
    return decodeCleartext(plaintext) as T;
  }

  static async toKey(keyStr: string, length = 32): Promise<Uint8Array> {
    const pwd = toUtf8Bytes(keyStr, UnicodeNormalizationForm.NFKD);
    const salt = toUtf8Bytes('BkbFTzFWLQPY7BxMSidY2m8Ipcqd5BOX', UnicodeNormalizationForm.NFKD);
    return scrypt(pwd, salt, N, r, p, length);
  }

  static async encryptWithKey(key: Uint8Array, plaintext: any): Promise<string> {
    const preparedCleartext = await prepareCleartext(plaintext);
    return SecurityService.encrypt(new XChaCha20Poly1305(key), preparedCleartext);
  }
  static async decryptWithKey<T>(key: Uint8Array, ciphertext: string): Promise<T> {
    const plaintext = await SecurityService.decrypt(new XChaCha20Poly1305(key), ciphertext);
    return decodeCleartext(plaintext) as T;
  }

  /**
   * 对数据进行加密
   * @param cipher
   * @param plaintext 明文数据
   * @private 内部使用
   */
  static async encrypt(cipher: XChaCha20Poly1305, plaintext: Uint8Array): Promise<string> {
    const iv = randomBytes(cipher.nonceLength);
    const sealed = cipher.seal(iv, plaintext);
    return JSON.stringify({
      sealed: u8a.toString(sealed, 'base64pad'),
      iv: u8a.toString(iv, 'base64pad'),
    });
  }

  /**
   * 对数据进行解密
   * @param cipher
   * @param ciphertext 密文 this.encrypt 加密结果
   * @private 内部使用
   */
  static async decrypt(cipher: XChaCha20Poly1305, ciphertext: string): Promise<Uint8Array> {
    const data = JSON.parse(ciphertext);
    const iv = u8a.fromString(data.iv, 'base64pad');
    const sealed = u8a.fromString(data.sealed, 'base64pad');
    const plaintext = cipher.open(iv, sealed);
    if (!plaintext) {
      throw new Error('解密失败');
    }
    // return decodeCleartext(plaintext) as T;
    return plaintext;
  }
}

export const securityService = new SecurityService();
