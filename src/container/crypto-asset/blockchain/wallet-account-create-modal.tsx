import React, { useState } from 'react';
import { Column, FormControl, IModalProps, Modal } from 'native-base';
import { lang } from '../../../locales';
import { Input } from '../../../components/Input';
import { WalletAccount } from '../../../entity/blockchain/wallet-account';
import { Button } from '../../../components/Button';

export type WalletAccountCreateModalProps = {
  accounts: Array<WalletAccount>;
  onCreate: (name: string, addressIndex: number) => void;
} & IModalProps;

/**
 *
 * @constructor
 */
export function WalletAccountCreateModal({ accounts, onCreate, ...props }: WalletAccountCreateModalProps) {
  const max = Math.max(...accounts.map<number>(item => item.addressIndex as number)) ?? 0;
  console.log(accounts, max);
  const [name, setName] = useState(`Account ${max + 1}`);
  const [addressIndex, setAddressIndex] = useState(`${max + 1}`);

  function handleCreate() {
    if (!name || !addressIndex) {
      return;
    }
    props.onClose?.();
    onCreate(name, Number.parseInt(addressIndex));
  }

  return (
    <Modal {...props} size="xl">
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>{lang('wallet.account.add')}</Modal.Header>
        <Modal.Body>
          <Column space={3}>
            <FormControl isRequired>
              <FormControl.Label>{lang('wallet.account.name')}</FormControl.Label>
              <Input value={name} onChangeText={setName} />
            </FormControl>
            <FormControl isRequired>
              <FormControl.Label>{lang('wallet.account.address.index')}</FormControl.Label>
              <Input keyboardType="numeric" value={addressIndex} onChangeText={setAddressIndex} />
              <FormControl.HelperText>{lang('wallet.account.address.index.tip')}</FormControl.HelperText>
            </FormControl>
            <Button onPress={handleCreate}>{lang('ok')}</Button>
          </Column>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
}
