import React, { Component } from 'react';
import { FlatList, View } from 'native-base';
import { walletService } from '../../services/Wallet';
import { autoBind } from 'jsdk/autoBind';
import { WalletToken } from '../../entity/Wallet';
import { TokenListItem } from './TokenListItem';

/**
 * 钱包管理页面
 */
@autoBind
export class Wallet extends Component<any, any> {
  constructor(props: any) {
    super(props);
    walletService.query();
  }

  renderItem({ item }: { item: WalletToken }) {
    return <TokenListItem {...item} />;
  }

  render() {
    const { selected } = walletService;
    return (
      <View>
        <FlatList data={selected?.tokens || []} renderItem={this.renderItem} />
      </View>
    );
  }
}
