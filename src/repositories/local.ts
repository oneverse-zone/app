import Loki from 'lokijs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Callback } from '@react-native-async-storage/async-storage/lib/typescript/types';

/**
 * Loki JS 数据库ReactNative 适配器
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 2017/10/23
 */
export default class LokiReactNativeAdapter {
  loadDatabase(dbname: string, callback: (data: any) => void) {
    AsyncStorage.getItem(dbname)
      .then(data => callback(data))
      .catch(err => {
        console.error(`open ${dbname} error.`, err);
        callback(new Error(err));
      });
  }

  saveDatabase(dbname: string, dbstring: string, callback: Callback) {
    AsyncStorage.setItem(dbname, dbstring, callback);
  }

  deleteDatabase(dbname: string, callback?: Callback) {
    AsyncStorage.removeItem(dbname, callback);
  }
}

export const localDB = new Loki('oneverse', {
  autosave: true,
  adapter: new LokiReactNativeAdapter(),
});
