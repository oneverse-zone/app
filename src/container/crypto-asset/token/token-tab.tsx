import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { autoBind } from 'jsdk/autoBind';
import { navigate } from '../../../core/navigation';
import { route } from '../../router';
import { TokenList } from '../components/TokenList';
import { tokenService } from '../../../services/blockchain/token';
import { walletManagerService } from '../../../services/blockchain/wallet-manager';
import { AccountToken } from '../../../entity/blockchain/wallet-account';

@observer
@autoBind
export class TokenTabScreen extends Component<any, any> {
  handleItemPress(item: AccountToken, index: number) {
    navigate(route.TokenDetail, { token: item, index });
  }

  render() {
    const { selectedAccount } = walletManagerService;
    const { selectTokens } = tokenService;
    return <TokenList walletAccount={selectedAccount!} data={selectTokens} onSelect={this.handleItemPress} />;
  }
}
