import React, { Component } from 'react';
import { Page } from '../../components/Page';
import { ListItem } from '../../components/ListItem';
import { lang } from '../../locales';
import { sessionService } from '../../services/Session';
import { repository } from '../../services/Repository';

/**
 * 设置页面
 */
export class Setting extends Component<any, any> {
  render() {
    return (
      <Page>
        <ListItem title="清理缓存" onPress={repository.clearCache} />
        <ListItem title={lang('logout')} onPress={sessionService.clearDevice} />
      </Page>
    );
  }
}
