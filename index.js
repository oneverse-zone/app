import './shim';
import './src/polyfill';

import { AppRegistry } from 'react-native';
import { configure } from 'mobx';
import { configurePersistable } from 'mobx-persist-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

import App from './src/container/App';
import { name as appName } from './app.json';

configurePersistable(
  {
    storage: AsyncStorage,
    expireIn: 31_557_600_000,
    removeOnExpiration: true,
    // debugMode: __DEV__,
  },
  { delay: __DEV__ ? 0 : 20000 },
);
// mobx 配置
configure({ enforceActions: 'never' });

AppRegistry.registerComponent(appName, () => App);
