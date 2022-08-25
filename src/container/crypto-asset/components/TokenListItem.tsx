import React from 'react';
import { ListItem, ListItemProps } from '../../../components/ListItem';
import { WalletAccount, AccountToken } from '../../../entity/blockchain/wallet-account';
import { TokenAvatar } from './token-avatar';
import { formatBalance } from '../../../utils/coin-utils';

export type TokenListItemProps = {
  walletAccount: WalletAccount;
} & AccountToken &
  ListItemProps;

/**
 * token 列表条目
 */
export function TokenListItem(props: TokenListItemProps) {
  const { walletAccount, balance, type, token, ...other } = props;
  const { symbol } = token;

  const avatar = <TokenAvatar token={token} />;

  return <ListItem icon={avatar} title={`${formatBalance(balance)} ${symbol}`} showArrow={false} {...other} />;
}
