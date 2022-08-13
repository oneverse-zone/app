import { FlatList } from 'native-base';
import React from 'react';
import { WalletToken } from '../../../entity/blockchain/wallet';
import { TokenListItem } from './TokenListItem';
import { IFlatListProps } from 'native-base/lib/typescript/components/basic/FlatList';

export type TokenListProps = {
  onSelect?: (token: WalletToken) => void;
} & Omit<IFlatListProps<WalletToken>, 'renderItem'>;

/**
 * token 列表
 * @param tokens
 * @constructor
 */
export function TokenList({ onSelect, ...props }: TokenListProps) {
  function handlePress(item: WalletToken) {
    onSelect?.(item);
  }

  function renderItem({ item }: { item: WalletToken }) {
    return <TokenListItem {...item} onPress={() => handlePress(item)} />;
  }

  return <FlatList {...props} renderItem={renderItem} />;
}
