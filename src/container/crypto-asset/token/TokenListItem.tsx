import React from 'react';
import { Avatar } from 'native-base';
import { Title } from '../../../components/Title';
import { ListItem, ListItemProps } from '../../../components/ListItem';
import { WalletAccount, FullToken } from '../../../entity/blockchain/wallet-account';

export type TokenListItemProps = {
  walletAccount: WalletAccount;
} & FullToken &
  ListItemProps;

/**
 * token 列表条目
 */
export function TokenListItem(props: TokenListItemProps) {
  const { walletAccount, address, balance, name, symbol, ...other } = props;
  const icon = (
    <Avatar size="sm" bg="white">
      {null ? <></> : name}
    </Avatar>
  );

  const footer = <Title title={`${balance}`} />;
  return <ListItem icon={icon} title={symbol} subtitle={name} footer={footer} showArrow={false} {...other} />;
}
