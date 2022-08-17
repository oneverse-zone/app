import AsyncStorage from '@react-native-async-storage/async-storage';

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

const dataKeys = [key.mnemonic, key.mnemonicBackupStatus, key.language];

/**
 * 数据仓库服务
 */
class Repository {
  findLanguage() {
    return AsyncStorage.getItem(key.language);
  }

  async saveLanguage(language: string) {
    await AsyncStorage.setItem(key.language, language);
  }

  /**
   * 账户助记词
   */
  async findMnemonic(): Promise<string | null> {
    return await AsyncStorage.getItem(key.mnemonic);
  }

  /**
   * 保存助记词
   */
  async saveMnemonic(mnemonic: string) {
    await AsyncStorage.setItem(key.mnemonic, mnemonic);
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

  get(key: string) {
    return AsyncStorage.getItem(key);
  }

  set(key: string, value: string) {
    return AsyncStorage.setItem(key, value);
  }

  async clearCache() {
    const keys = await AsyncStorage.getAllKeys();
    await Promise.all(keys.filter(item => !dataKeys.includes(item)).map(key => AsyncStorage.removeItem(key)));
  }

  async clearAll() {
    await AsyncStorage.clear();
  }
}

export const repository = new Repository();
