import { repository } from './Repository';
import { securityService } from './security';

const passwordStorageKey = '';

const text = `I love OneVerse`;

/**
 * 密码服务
 */
class PasswordService {
  /**
   * 设置密码
   * @param password
   */
  async setPassword(password: string) {
    const v = await repository.get(passwordStorageKey);
    if (v) {
      console.info(`密码已经存在`);
      return;
    }
    const data = await securityService.encrypt(text);
    await repository.set(passwordStorageKey, data);
  }
}

export const passwordService = new PasswordService();
