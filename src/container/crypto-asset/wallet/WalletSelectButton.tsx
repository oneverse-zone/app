import React, { Component } from 'react';
import { autoBind } from 'jsdk/autoBind';
import { observer } from 'mobx-react';
import { Button } from '../../../components/Button';
import { walletService } from '../../../services/Wallet';
import { lang } from '../../../locales';
import { navigate } from '../../../core/navigation';
import { route } from '../../router';

/**
 * 钱包选择Button
 */
@observer
@autoBind
export class WalletSelectButton extends Component<any, any> {
  handlePress() {
    navigate(route.WalletSelect);
  }

  render() {
    const { selected } = walletService;
    return (
      <Button size="xs" minW={50} bgColor="gray.200" _text={{ color: 'darkText' }} onPress={this.handlePress}>
        {selected ? selected.name : lang('wallet.select')}
      </Button>
    );
  }
}
