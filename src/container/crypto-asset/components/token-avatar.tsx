import React from 'react';
import { Avatar, IAvatarProps } from 'native-base';
import { Token, TokenType } from '../../../entity/blockchain/token';
import { logos } from '../../../components/BlockchainAvatar';

export type TokenAvatarProps = {
  token: Token;
} & IAvatarProps;

export function TokenAvatar({ token, ...props }: TokenAvatarProps) {
  let icon;
  let baseProps: IAvatarProps = {
    bg: 'transparent',
  };
  if (token.type === TokenType.COIN) {
    const Logo = logos[token.blockchainId];
    icon = Logo && <Logo />;
  }
  if (!icon) {
    icon = token.symbol.charAt(0);
    baseProps.bg = 'primary.500';
  }
  return (
    <Avatar size="sm" {...baseProps} {...props}>
      {icon}
    </Avatar>
  );
}
