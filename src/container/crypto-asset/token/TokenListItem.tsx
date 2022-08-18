import React from 'react';
import { Avatar } from 'native-base';
import { Title } from '../../../components/Title';
import { ListItem, ListItemProps } from '../../../components/ListItem';
import { WalletToken } from '../../../entity/blockchain/wallet-account';

export type TokenListItemProps = {} & WalletToken & ListItemProps;

/**
 * token 列表条目
 */
export function TokenListItem(props: TokenListItemProps) {
  const { id, address, symbol, balance, name, ...other } = props;
  const icon = (
    <Avatar size="sm" bg="white">
      {null ? <></> : other}
    </Avatar>
  );

  const footer = <Title title={`${balance}`} />;
  return <ListItem icon={icon} title={symbol} subtitle={name} footer={footer} showArrow={false} {...other} />;
}
