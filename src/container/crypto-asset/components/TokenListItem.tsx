import React from 'react';
import { ListItem, ListItemProps } from '../../../components/ListItem';
import { FullToken, WalletAccount } from '../../../entity/blockchain/wallet-account';
import { TokenAvatar } from './token-avatar';
import { formatBalance } from '../../../utils/coin-utils';

export type TokenListItemProps = {
  walletAccount: WalletAccount;
} & FullToken &
  ListItemProps;

/**
 * token 列表条目
 */
export function TokenListItem(props: TokenListItemProps) {
  const { walletAccount, address, balance, name, symbol, blockchainId, type, ...other } = props;

  const avatar = <TokenAvatar token={props} />;

  return <ListItem icon={avatar} title={`${formatBalance(balance)} ${symbol}`} showArrow={false} {...other} />;
}
