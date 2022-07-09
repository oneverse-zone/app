import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { autoBind } from 'jsdk/autoBind';
import { Column } from 'native-base';

import { sessionService } from '../services/Session';
import { Page } from '../components/Page';
import { navigate, resetTo } from '../core/navigation';
import { route } from './router';
import { lang } from '../locales';
import { PageTitle } from '../components/PageTitle';
import { Button } from '../components/Button';

/**
 * 开始屏
 * 引导用户创建或者导入账号
 */
@observer
@autoBind
export class Start extends Component<any, any> {
  static options = {
    title: lang('app.name'),
    headerShadowVisible: false,
  };

  /**
   * 处理账号注册
   */
  async handleCreate() {
    navigate(route.RegisterOne);
  }

  /**
   * 导入账号
   */
  async handleImport() {
    navigate(route.ImportIdentify);
  }

  render() {
    return (
      <Page flex={1} padding={3}>
        <PageTitle title={lang('identify.setting')} description={lang('identify.setting.tip')} />
        <Column space={3} justifyContent="flex-end" alignItems="center" flex={1} safeAreaBottom mb={20}>
          <Button variant="outline" onPress={this.handleImport} width={230} borderColor="primary.500">
            {'使用助记词导入'}
          </Button>
          <Button onPress={this.handleCreate} width={230}>
            {'创建新的去中心化身份'}
          </Button>
        </Column>
      </Page>
    );
  }
}
