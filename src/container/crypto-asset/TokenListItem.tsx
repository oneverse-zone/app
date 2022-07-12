import React, { useEffect, useState } from 'react';
import { Avatar } from 'native-base';
import { findToken } from '../../constants/Token';
import { Title } from '../../components/Title';
import { ListItem } from '../../components/ListItem';
import { WalletToken } from '../../entity/Wallet';
import { walletService } from '../../services/Wallet';

async function findBalance(token: WalletToken, setBalance: (v: any) => void) {
  const balance = await walletService.getBalance(token);
  setBalance(balance);
}

/**
 * token 列表条目
 */
export function TokenListItem(props: WalletToken) {
  const { token, balance } = props;
  const [newBalance, setBalance] = useState(balance);
  const Logo = findToken(token.coinId, token.contractAddress)?.logo;
  const icon = Logo && (
    <Avatar size="sm" bg="white">
      <Logo />
    </Avatar>
  );

  useEffect(() => {
    findBalance(props, setBalance);
  }, []);

  const footer = <Title title={`${newBalance}`} />;
  return (
    <ListItem icon={icon} title={token.symbol} subtitle={token.blockchain.name} footer={footer} showArrow={false} />
  );
}
