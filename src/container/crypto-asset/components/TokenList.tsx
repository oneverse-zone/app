import { FlatList } from 'native-base';
import React from 'react';
import { TokenListItem } from './TokenListItem';
import { IFlatListProps } from 'native-base/lib/typescript/components/basic/FlatList';
import { FullToken, WalletAccount } from '../../../entity/blockchain/wallet-account';

export type TokenListProps = {
  walletAccount: WalletAccount;
  onSelect?: (token: FullToken, index: number) => void;
} & Omit<IFlatListProps<FullToken>, 'renderItem'>;

/**
 * token 列表
 * @param tokens
 * @constructor
 */
export function TokenList({ walletAccount, onSelect, ...props }: TokenListProps) {
  function handlePress(item: FullToken, index: number) {
    onSelect?.(item, index);
  }

  function renderItem({ item, index }: { item: FullToken; index: number }) {
    return <TokenListItem walletAccount={walletAccount} {...item} onPress={() => handlePress(item, index)} />;
  }

  return <FlatList {...props} renderItem={renderItem} />;
}
