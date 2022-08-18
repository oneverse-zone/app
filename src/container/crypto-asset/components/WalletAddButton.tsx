import React from 'react';
import { AddIcon, IconButton } from 'native-base';
import { navigate } from '../../../core/navigation';
import { route } from '../../router';

function handleCreate() {
  navigate(route.BlockchainSelect);
}

export function WalletAddButton() {
  return <IconButton borderRadius="full" icon={<AddIcon />} onPress={handleCreate} />;
}
