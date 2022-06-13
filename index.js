// import './shim';

// store 模块错误修复
global.navigator.userAgent = '';
// ReferenceError: Can't find variable: TextEncoder
import 'text-encoding-polyfill';

import {AppRegistry} from 'react-native';
import App from './src/container/App';
import {name as appName} from './app.json';
import {configure} from 'mobx';

// mobx 配置
configure({enforceActions: 'never'});

AppRegistry.registerComponent(appName, () => App);
