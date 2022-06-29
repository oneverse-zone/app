import React, { Component } from 'react';
import { Alert } from 'react-native';
import { observer } from 'mobx-react';
import { autoBind } from 'jsdk/autoBind';

import { sessionService } from '../services/Session';
import { Page } from '../components/Page';
import { Button, Column } from 'native-base';
import { navigate, resetTo } from '../core/navigation';
import { route } from './router';
import { hasUserSetPinCode } from '@haskkor/react-native-pincode';

/**
 * 开始屏
 * 引导用户创建或者导入账号
 */
@observer
@autoBind
export class Start extends Component<any, any> {
  static options = {
    headerShown: false,
  };

  async check() {
    const hasPinCode = await hasUserSetPinCode();
    const { locked } = sessionService;
    if (hasPinCode && !locked) {
      return false;
    }
    navigate(route.PinCode);
    return true;
  }

  /**
   * 处理账号注册
   */
  async handleCreate() {
    if (await this.check()) {
      return;
    }
    await sessionService.registerAndLogin();
    Alert.alert('欢迎来到OneVerse', '恭喜您成功创建一个Web3去中心化DID账户', [
      {
        text: '进入OneVerse',
        onPress: () => resetTo(route.Home),
      },
    ]);
  }

  /**
   * 导入账号
   */
  async handleImport() {
    if (await this.check()) {
      return;
    }
    resetTo(route.ImportIdentify);
  }

  render() {
    const { loading } = sessionService;
    return (
      <Page flex={1} justifyContent="center" Root={Column} space={3.5} padding={3} loading={loading}>
        <Button onPress={this.handleImport}>{'导入您的去中心化身份'}</Button>
        <Button variant="ghost" onPress={this.handleCreate}>
          {'创建一个去中心化身份'}
        </Button>
      </Page>
    );
  }
}
