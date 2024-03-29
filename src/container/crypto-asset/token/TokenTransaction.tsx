import React, { Component } from 'react';
import { autoBind } from 'jsdk/autoBind';
import { observer } from 'mobx-react';
import { FlatList } from 'native-base';
import { ListRenderItemInfo } from 'react-native';
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
    // await tokenTransactionService.query({
    //   type,
    //   token,
    // });
  }

  renderItem({ item }: ListRenderItemInfo<TokenTransaction>) {
    const footer = <Title title={item.value} />;
    return <ListItem title={item.address} footer={footer} showArrow={false} />;
  }

  render() {
    // const { page } = tokenTransactionService;
    return (
      <>
        <FlatList data={[]} renderItem={this.renderItem} />
      </>
    );
  }
}
