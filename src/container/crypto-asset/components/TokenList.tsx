import React from 'react';
import { TokenListItem } from './TokenListItem';
import { AccountToken, WalletAccount } from '../../../entity/blockchain/wallet-account';

export type TokenListProps = {
  walletAccount: WalletAccount;
  onSelect?: (token: AccountToken, index: number) => void;
  data: Array<AccountToken>;
};

/**
 * token 列表
 * @param tokens
 * @constructor
 */
export function TokenList({ walletAccount, onSelect, ...props }: TokenListProps) {
  function handlePress(item: AccountToken, index: number) {
    onSelect?.(item, index);
  }

  function renderItem(item: AccountToken, index: number) {
    return (
      <TokenListItem key={index} walletAccount={walletAccount} {...item} onPress={() => handlePress(item, index)} />
    );
  }

  return <>{props.data?.map(renderItem)}</>;
}
