import React from 'react';
import { Avatar } from 'native-base';
import { Title } from '../../../components/Title';
import { ListItem, ListItemProps } from '../../../components/ListItem';
import { WalletToken } from '../../../entity/Wallet';
import { tokenService } from '../../../services/Token';

export type TokenListItemProps = {} & WalletToken & ListItemProps;

/**
 * token 列表条目
 */
export function TokenListItem(props: TokenListItemProps) {
  const { walletName, coinId, contractAddress, symbol, blockchain, balance, ...other } = props;
  const Logo = tokenService.findToken(coinId, contractAddress)?.logo;
  const icon = Logo && (
    <Avatar size="sm" bg="white">
      <Logo />
    </Avatar>
  );

  const footer = <Title title={`${balance}`} />;
  return (
    <ListItem icon={icon} title={walletName} subtitle={blockchain.name} footer={footer} showArrow={false} {...other} />
  );
}
