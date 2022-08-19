import { FlatList } from 'native-base';
import React from 'react';
import { TokenListItem } from './TokenListItem';
import { IFlatListProps } from 'native-base/lib/typescript/components/basic/FlatList';
import { FullToken, WalletAccount } from '../../../entity/blockchain/wallet-account';

export type TokenListProps = {
  walletAccount: WalletAccount;
  onSelect?: (token: FullToken) => void;
} & Omit<IFlatListProps<FullToken>, 'renderItem'>;

/**
 * token 列表
 * @param tokens
 * @constructor
 */
export function TokenList({ walletAccount, onSelect, ...props }: TokenListProps) {
  function handlePress(item: FullToken) {
    onSelect?.(item);
  }

  function renderItem({ item }: { item: FullToken }) {
    return <TokenListItem walletAccount={walletAccount} {...item} onPress={() => handlePress(item)} />;
  }

  return <FlatList {...props} renderItem={renderItem} />;
}
