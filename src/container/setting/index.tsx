import React, { Component } from 'react';
import { Page } from '../../components/Page';
import { ListItem } from '../../components/ListItem';
import { lang } from '../../locales';
import { sessionService } from '../../services/Session';

/**
 * 设置页面
 */
export class Setting extends Component<any, any> {
  render() {
    return (
      <Page>
        <ListItem title={lang('logout')} onPress={sessionService.logout} />
      </Page>
    );
  }
}
