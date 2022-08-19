import React from 'react';
import { Avatar } from 'native-base';
import { Title } from '../../../components/Title';
import { ListItem, ListItemProps } from '../../../components/ListItem';
import { FullToken, WalletAccount } from '../../../entity/blockchain/wallet-account';
import { TokenType } from '../../../entity/blockchain/token';
import { logos } from '../../../components/BlockchainAvatar';

export type TokenListItemProps = {
  walletAccount: WalletAccount;
} & FullToken &
  ListItemProps;

/**
 * token 列表条目
 */
export function TokenListItem(props: TokenListItemProps) {
  const { walletAccount, address, balance, name, symbol, blockchainId, type, ...other } = props;

  let icon;
  if (type === TokenType.COIN) {
    const Logo = logos[blockchainId];
    icon = Logo && <Logo />;
  }
  if (!icon) {
    icon = name.charAt(0);
  }
  const avatar = (
    <Avatar size="sm" bg="white">
      {icon}
    </Avatar>
  );

  return <ListItem icon={avatar} title={`${balance} ${symbol}`} showArrow={false} {...other} />;
}
