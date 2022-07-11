import React, { useEffect, useState } from 'react';
import { findToken } from '../../constants/Token';
import { Title } from '../../components/Title';
import { ListItem } from '../../components/ListItem';
import { WalletToken } from '../../entity/Wallet';
import { Avatar } from 'native-base';
import { getDefaultProvider } from '@ethersproject/providers';
import { ethereumApi } from '../../constants/Url';

async function findBalance(address: string, setBalance: (v: any) => void) {
  try {
    const balance = await getDefaultProvider(ethereumApi).getBalance(address);
    console.log(`${address} Balance:  ${balance}`);
    setBalance(balance);
  } catch (e: any) {
    console.log(`余额查询失败: ${e.message}`);
  }
}

/**
 * token 列表条目
 */
export function TokenListItem({ token, balance, address }: WalletToken) {
  const [newBalance, setBalance] = useState(balance);
  const Logo = findToken(token.coinId, token.contractAddress)?.logo;
  const icon = Logo && (
    <Avatar size="sm" bg="white">
      <Logo />
    </Avatar>
  );

  useEffect(() => {
    findBalance(address, setBalance);
  }, []);

  const footer = <Title title={`${newBalance}`} />;
  return (
    <ListItem icon={icon} title={token.symbol} subtitle={token.blockchain.name} footer={footer} showArrow={false} />
  );
}
