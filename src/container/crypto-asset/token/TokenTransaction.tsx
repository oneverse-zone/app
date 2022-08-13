import React, { Component } from 'react';
import { autoBind } from 'jsdk/autoBind';
import { observer } from 'mobx-react';
import { Box, FlatList } from 'native-base';
import { goBack } from '../../../core/navigation';
import { walletService } from '../../../services/wallet-manager';
import { tokenTransactionService } from '../../../services/blockchain/TokenTransaction';
import { ListRenderItem, ListRenderItemInfo } from 'react-native';
import { ListItem } from '../../../components/ListItem';
import { TokenTransaction } from '../../../entity/Transaction';
import { Title } from '../../../components/Title';

/**
 * Token 交易信息
 */
@observer
@autoBind
export class TokenTransactionScreen extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.handleSearch();
  }

  async handleSearch() {
    const { token, type } = this.props.route?.params || {};
    if (!token) {
      console.log(this.props);
      return;
    }
    await tokenTransactionService.query({
      type,
      token,
    });
  }

  renderItem({ item }: ListRenderItemInfo<TokenTransaction>) {
    const footer = <Title title={item.value} />;
    return <ListItem title={item.address} footer={footer} showArrow={false} />;
  }

  render() {
    const { page } = tokenTransactionService;
    return (
      <>
        <FlatList data={page.content as any} renderItem={this.renderItem} />
      </>
    );
  }
}
