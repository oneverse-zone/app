import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { autoBind } from 'jsdk/autoBind';
import { Box, FlatList } from 'native-base';
import { WalletToken } from '../../../entity/Wallet';
import { TokenListItem } from './TokenListItem';
import { walletService } from '../../../services/Wallet';
import { navigate } from '../../../core/navigation';
import { route } from '../../router';

@observer
@autoBind
export class TokenScreen extends Component<any, any> {
  handleItemPress(item: WalletToken) {
    navigate(route.TokenDetail, item);
  }

  renderItem({ item }: { item: WalletToken }) {
    return <TokenListItem {...item} onPress={() => this.handleItemPress(item)} />;
  }

  render() {
    const { selected } = walletService;

    return (
      <Box>
        <FlatList data={selected?.tokens || []} renderItem={this.renderItem} />
      </Box>
    );
  }
}
