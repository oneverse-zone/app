import React from 'react';
import { AlertDialog, Text } from 'native-base';
import { lang } from '../../locales';

export type MnemonicAlertProps = {
  open: boolean;
  onClose: () => void;
};

/**
 * 什么是助记词 说明弹框
 * @param open 是否开启
 * @param onClose 弹框关闭回调
 * @constructor
 */
export function MnemonicAlert({ open, onClose }: MnemonicAlertProps) {
  const cancelRef = React.useRef(null);

  return (
    <AlertDialog isOpen={open} onClose={onClose} leastDestructiveRef={cancelRef}>
      <AlertDialog.Content>
        <AlertDialog.CloseButton />
        <AlertDialog.Header>{lang('mnemonic')}</AlertDialog.Header>
        <AlertDialog.Body>
          <Text>
            {'助记词是一组12或24个字词,包含与您的帐户相关的所有信息,包括您的资金。它像是用来访问整个帐户的一组密码。'}
          </Text>
          <Text>{'您必须确保助记词保密、安全。如果有人得到您的助记词，他们将能够控制您的帐户。'}</Text>
          <Text>{'将它保存在只有您能够接触的地方。一旦丢失，即使是OneVerse也无法帮您找回。'}</Text>
        </AlertDialog.Body>
      </AlertDialog.Content>
    </AlertDialog>
  );
}
