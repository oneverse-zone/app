import * as Keychain from 'react-native-keychain';

const service = 'device-password';

/**
 * 密码服务
 */
class PasswordService {
  async hasPassword(): Promise<boolean> {
    return !!(await this.credentials());
  }

  /**
   * 设置密码
   * @param password
   */
  async setPassword(password: string): Promise<void> {
    if (await this.hasPassword()) {
      console.info(`密码已经存在`);
      return;
    }
    const result = await Keychain.setGenericPassword('device', password, {
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      securityLevel: Keychain.SECURITY_LEVEL.SECURE_HARDWARE,
      service,
    });
    console.log(`密码存储完成: `, result);
  }

  async verify(password: string) {
    const credentials = await this.credentials();
    return credentials && credentials.password === password;
  }

  private async credentials() {
    return await Keychain.getGenericPassword({ service, securityLevel: Keychain.SECURITY_LEVEL.SECURE_HARDWARE });
  }
}

export const passwordService = new PasswordService();
