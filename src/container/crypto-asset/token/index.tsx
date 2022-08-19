import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { autoBind } from 'jsdk/autoBind';
import { Box } from 'native-base';
import { navigate } from '../../../core/navigation';
import { route } from '../../router';
import { TokenList } from './TokenList';
import { FullToken } from '../../../entity/blockchain/wallet-account';
import { tokenService } from '../../../services/blockchain/token';
import { walletManagerService } from '../../../services/blockchain/wallet-manager';

@observer
@autoBind
export class TokenScreen extends Component<any, any> {
  componentDidMount() {
    const { selectedAccount } = walletManagerService;
    if (selectedAccount) {
      // tokenService.updateAccountToken(selectedAccount);
    }
  }

  handleItemPress(item: FullToken) {
    navigate(route.TokenDetail, item);
  }

  render() {
    const { selectedAccount } = walletManagerService;
    const { tokens } = tokenService;
    return (
      <Box>
        <TokenList
          walletAccount={selectedAccount!}
          data={tokens[selectedAccount?.id ?? ''] ?? []}
          onSelect={this.handleItemPress}
        />
      </Box>
    );
  }
}
