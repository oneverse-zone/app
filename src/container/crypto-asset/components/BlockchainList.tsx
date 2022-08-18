import React from 'react';
import { SectionList } from 'react-native';
import { lang } from '../../../locales';
import { Blockchain, Blockchain as BlockchainEntity } from '../../../entity/blockchain/blockchain';
import { ListItem } from '../../../components/ListItem';
import { CheckIcon, Text } from 'native-base';
import { BlockchainAvatar } from '../../../components/BlockchainAvatar';

export type BlockchainListProps = {
  /**
   * 当前选择的链
   */
  selected?: Blockchain;

  /**
   * 主网链
   */
  mainNets: Array<Blockchain>;

  /**
   * 测试网链
   */
  testNets: Array<Blockchain>;

  /**
   * 自定义网链
   */
  customNets: Array<Blockchain>;

  /**
   * 当链条目点击时回调
   * @param item 链信息
   */
  onItemPress?: (item: BlockchainEntity) => void;
};

/**
 * 区块链选择
 */
export function BlockchainList({ selected, mainNets, testNets, customNets, onItemPress }: BlockchainListProps) {
  const data = [
    {
      title: lang('blockchain.main'),
      data: mainNets.slice(),
    },
    {
      title: lang('blockchain.test'),
      data: testNets.slice(),
    },
    {
      title: lang('blockchain.custom'),
      data: customNets.slice(),
    },
  ];

  function renderSectionHeader({ section: { title } }: any) {
    return <Text padding={3}>{title}</Text>;
  }

  function renderItem({ item }: { item: BlockchainEntity }) {
    const icon = <BlockchainAvatar blockchain={item} />;
    let selectIcon;
    if (selected?.id === item.id) {
      selectIcon = <CheckIcon color="primary.500" />;
    }
    return (
      <ListItem
        icon={icon}
        title={item.name}
        footer={selectIcon}
        onPress={onItemPress && (() => onItemPress(item))}
        showArrow={false}
      />
    );
  }

  return <SectionList sections={data} renderItem={renderItem} renderSectionHeader={renderSectionHeader} />;
}
