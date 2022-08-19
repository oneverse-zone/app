import React from 'react';
import { Avatar, IAvatarProps } from 'native-base';
import { Token, TokenType } from '../../../entity/blockchain/token';
import { logos } from '../../../components/BlockchainAvatar';

export type TokenAvatarProps = {
  token: Token;
} & IAvatarProps;

export function TokenAvatar({ token, ...props }: TokenAvatarProps) {
  let icon;
  if (token.type === TokenType.COIN) {
    const Logo = logos[token.blockchainId];
    icon = Logo && <Logo />;
  }
  if (!icon) {
    icon = token.name.charAt(0);
  }
  return (
    <Avatar size="sm" bg="white" {...props}>
      {icon}
    </Avatar>
  );
}
