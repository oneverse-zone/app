import React from 'react';
import { Actionsheet, Box, IActionsheetProps, Text } from 'native-base';
import { lang } from '../../../locales';

export type Action = 'create' | 'recover';

export type WalletNewActionSheetProps = {
  onSelect?: (type: Action) => void;
} & IActionsheetProps;

/**
 * 新钱包创建方式选择
 * 创建/导入
 * @constructor
 */
export function WalletNewActionSheet({ onSelect, ...props }: WalletNewActionSheetProps) {
  function handleNew() {
    onSelect && onSelect('create');
  }

  function handleImport() {
    onSelect && onSelect('recover');
  }

  return (
    <Actionsheet {...props}>
      <Actionsheet.Content>
        <Actionsheet.Item onPress={handleNew}>{lang('wallet.create')}</Actionsheet.Item>
        <Actionsheet.Item onPress={handleImport}>{lang('wallet.recover')}</Actionsheet.Item>
        <Actionsheet.Item alignItems="center" onPress={props.onClose}>
          {lang('cancel')}
        </Actionsheet.Item>
      </Actionsheet.Content>
    </Actionsheet>
  );
}
