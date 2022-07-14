import React, { Component } from 'react';
import { autoBind } from 'jsdk/autoBind';
import { observer } from 'mobx-react';
import { SectionList } from 'react-native';
import { lang } from '../../../locales';
import { blockchainService } from '../../../services/Blockchain';
import { Blockchain as BlockchainEntity } from '../../../entity/Blockchain';
import { ListItem } from '../../../components/ListItem';
import { Avatar, Text } from 'native-base';

export type BlockchainListProps = {
  /**
   * 当链条目点击时回调
   * @param item 链信息
   */
  onItemPress?: (item: BlockchainEntity) => void;
};

/**
 * 区块链选择
 */
@observer
@autoBind
export class BlockchainList extends Component<BlockchainListProps, any> {
  renderSectionHeader({ section: { title } }: any) {
    return <Text padding={3}>{title}</Text>;
  }

  renderItem({ item }: { item: BlockchainEntity }) {
    const { onItemPress } = this.props;

    const Logo = item.logo;
    const iconElement = Logo ? <Logo /> : item.name;
    const icon = (
      <Avatar size="sm" bg="white">
        {iconElement}
      </Avatar>
    );

    return <ListItem icon={icon} title={item.name} onPress={onItemPress && (() => onItemPress(item))} />;
  }

  render() {
    const { blockchains, customBlockchains } = blockchainService;
    const data = [
      {
        title: lang('wallet.single-chain'),
        data: blockchains.slice(),
      },
      {
        title: lang('blockchain.custom'),
        data: customBlockchains.slice(),
      },
    ];
    return <SectionList sections={data} renderItem={this.renderItem} renderSectionHeader={this.renderSectionHeader} />;
  }
}
