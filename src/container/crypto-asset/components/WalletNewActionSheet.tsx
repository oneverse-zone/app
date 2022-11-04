import React from 'react';
import { Actionsheet, Box, IActionsheetProps, Text } from 'native-base';
import { lang } from '../../../locales';
import { Wallet } from '../../../entity/blockchain/wallet';
import { navigate } from '../../../core/navigation';
import { route } from '../../../core/route.config';
import { walletManagerService } from '../../../services/blockchain/wallet-manager';

export type CreateWalletActionSheetProps = {
  didWallet?: Wallet;
} & IActionsheetProps;

function renderItem(title: string, describe: string, onPress?: any) {
  return (
    <Actionsheet.Item onPress={onPress}>
      <Text fontWeight="500" fontSize="md">
        {title}
      </Text>
      <Text fontSize="xs" color="coolGray.500">
        {describe}
      </Text>
    </Actionsheet.Item>
  );
}

/**
 * 创建钱包ActionSheet
 * @constructor
 */
export function WalletNewActionSheet({ didWallet, ...props }: CreateWalletActionSheetProps) {
  function handleCreate() {
    navigate(route.WalletCreate);
    props.onClose?.();
  }

  function handleRecover() {
    navigate(route.WalletRecover);
    props.onClose?.();
  }

  async function handleInitHd() {
    props.onClose?.();
    await walletManagerService.initDIDHDWallet('Wallet HD');
  }

  return (
    <Actionsheet {...props}>
      <Actionsheet.Content>
        <Box w="100%" h={60} px={4} justifyContent="center" alignItems="center">
          <Text color="coolGray.500">{lang('wallet.create')}</Text>
        </Box>
        {didWallet
          ? null
          : renderItem(
              `${lang('wallet.create.did')}(${lang('recommend')})`,
              lang('wallet.create.did.describe'),
              handleInitHd,
            )}
        {renderItem(lang('wallet.create.hd'), lang('wallet.create.hd.describe'), handleCreate)}
        {renderItem(lang('wallet.recover'), lang('wallet.recover.describe'), handleRecover)}
        <Actionsheet.Item alignItems="center" onPress={props.onClose}>
          {lang('cancel')}
        </Actionsheet.Item>
      </Actionsheet.Content>
    </Actionsheet>
  );
}
