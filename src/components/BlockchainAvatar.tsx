import React from 'react';
import { Avatar, IAvatarProps, Text } from 'native-base';
import { Blockchain } from '../entity/blockchain/blockchain';
import { bitcoin, ethereum, polygon } from '../services/blockchain';

import btcLogo from '../assets/svg/token-logo/bitcoin-btc.svg';
import ethLogo from '../assets/svg/token-logo/ethereum-eth.svg';
import maticLogo from '../assets/svg/token-logo/polygon-matic.svg';

export type BlockchainAvatar = {
  blockchain: Blockchain;
} & IAvatarProps;

export const logos: Record<string, any> = {
  [bitcoin.id]: btcLogo,
  [ethereum.id]: ethLogo,
  [polygon.id]: maticLogo,
};

/**
 * 链logo
 * @param blockchain
 * @constructor
 */
export function BlockchainAvatar({ blockchain, ...props }: BlockchainAvatar) {
  const Logo = logos[blockchain.id];
  return (
    <Avatar bg="white" {...props}>
      {Logo ? <Logo /> : <Text>{blockchain.name}</Text>}
    </Avatar>
  );
}
