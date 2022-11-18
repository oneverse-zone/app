import React from 'react';
import { IconButton, useTheme } from 'native-base';
import { navigate } from '../../../core/navigation';
import { route } from '../../../core/route.config';
import WalletIcon from '../../../assets/svg/wallet.svg';

function handlePress() {
  navigate(route.WalletManager);
}

/**
 * 钱包选择Button
 */
export function WalletSelectButton() {
  const { colors } = useTheme();
  console.log(WalletIcon);
  return (
    <IconButton
      borderRadius="full"
      icon={<WalletIcon color="white" width={24} height={24} fill={colors.primary['500']} />}
      onPress={handlePress}
    />
  );
}
