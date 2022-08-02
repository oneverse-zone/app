import React, { Component } from 'react';
import { View } from 'native-base';
import { WalletList } from './components/WalletList';
import { autoBind } from 'jsdk/autoBind';
import { observer } from 'mobx-react';
import { walletService } from '../../../services/Wallet';
import { Wallet } from '../../../entity/Wallet';
import { goBack, replace } from '../../../core/navigation';
import { lang } from '../../../locales';

/**
 * 钱包选择页面
 */
@observer
@autoBind
export class WalletSelect extends Component<any, any> {
  static options = {
    title: lang('wallet.select'),
    presentation: 'modal',
  };

  handleSelect(wallet: Wallet, index: number) {
    walletService.selectWallet(index);
    const { nextRoute, autoBack = true } = this.props.route.params || {};
    if (nextRoute) {
      replace(nextRoute);
    } else if (autoBack) {
      goBack();
    }
  }

  render() {
    const { wallet, list } = walletService;
    return (
      <View>
        <WalletList wallet={wallet} singleChainWallets={list} onItemPress={this.handleSelect} />
      </View>
    );
  }
}
