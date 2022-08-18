import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { autoBind } from 'jsdk/autoBind';
import { Box } from 'native-base';
import { navigate } from '../../../core/navigation';
import { route } from '../../router';
import { TokenList } from './TokenList';
import { walletAccountService } from '../../../services/blockchain/wallet-account';
import { WalletToken } from '../../../entity/blockchain/wallet-account';

@observer
@autoBind
export class TokenScreen extends Component<any, any> {
  handleItemPress(item: WalletToken) {
    navigate(route.TokenDetail, item);
  }

  render() {
    const { selected } = walletAccountService;

    return (
      <Box>
        <TokenList data={selected?.tokens ?? []} onSelect={this.handleItemPress} />
      </Box>
    );
  }
}
