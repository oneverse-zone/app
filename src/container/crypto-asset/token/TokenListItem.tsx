import React from 'react';
import { Avatar } from 'native-base';
import { findToken } from '../../../constants/Token';
import { Title } from '../../../components/Title';
import { ListItem, ListItemProps } from '../../../components/ListItem';
import { WalletToken } from '../../../entity/Wallet';

export type TokenListItemProps = {} & WalletToken & ListItemProps;

/**
 * token 列表条目
 */
export function TokenListItem(props: TokenListItemProps) {
  const { coinId, contractAddress, symbol, blockchain, balance, ...other } = props;
  const Logo = findToken(coinId, contractAddress)?.logo;
  const icon = Logo && (
    <Avatar size="sm" bg="white">
      <Logo />
    </Avatar>
  );

  const footer = <Title title={`${balance}`} />;
  return (
    <ListItem icon={icon} title={symbol} subtitle={blockchain.name} footer={footer} showArrow={false} {...other} />
  );
}
