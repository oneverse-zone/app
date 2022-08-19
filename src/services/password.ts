import { repository } from './Repository';
import { SecurityService } from './security';

const passwordStorageKey = 'JBICS45PXMCIcNbTDvhQVr9Pb0yJwSKi';

const text = `I love OneVerse`;

/**
 * 密码服务
 */
class PasswordService {
  async hasPassword(): Promise<boolean> {
    return !!(await repository.get(passwordStorageKey));
  }

  /**
   * 设置密码
   * @param password
   */
  async setPassword(password: string): Promise<void> {
    const v = await repository.get(passwordStorageKey);
    if (v) {
      console.info(`密码已经存在`);
      return;
    }
    const key = await SecurityService.toKey(password);

    const data = await SecurityService.encryptWithKey(key, text);
    await repository.set(passwordStorageKey, data);
  }

  async verify(password: string) {
    const data = await repository.get(passwordStorageKey);
    if (!data) {
      return false;
    }
    try {
      const key = await SecurityService.toKey(password);
      const plaintext = await SecurityService.decryptWithKey(key, data);
      return plaintext === text;
    } catch (e) {
      return false;
    }
  }
}

export const passwordService = new PasswordService();
