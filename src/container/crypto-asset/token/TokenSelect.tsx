import React, { Component } from 'react';
import { autoBind } from 'jsdk/autoBind';
import { observer } from 'mobx-react';
import { Page } from '../../../components/Page';
import { walletService } from '../../../services/Wallet';
import { TokenList } from './TokenList';
import { navigate, replace } from '../../../core/navigation';
import { WalletToken } from '../../../entity/Wallet';
import { lang } from '../../../locales';

/**
 * 列出当前钱包的token 并可进行点击选择
 * 接收一个路由参数nextRoute，当选择一个token以后进行页面跳转
 */
@observer
@autoBind
export class TokenSelect extends Component<any, any> {
  static options = {
    title: lang('token.select'),
    presentation: 'modal',
  };

  handleSelect(token: WalletToken) {
    const { nextRoute, nextRouteParams = {} } = this.props.route?.params || {};
    if (!nextRoute) {
      console.log('没有传递吓一跳路由参数');
      return;
    }
    console.log(token, nextRoute);
    replace(nextRoute, {
      ...nextRouteParams,
      ...token,
    });
  }

  render() {
    const { selected } = walletService;
    return <TokenList data={selected?.tokens || []} onSelect={this.handleSelect} />;
  }
}
