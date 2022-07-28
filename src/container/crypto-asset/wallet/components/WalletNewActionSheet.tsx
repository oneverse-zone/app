import React from 'react';
import { Actionsheet, Box, Divider, IActionsheetProps, ITextProps, Text } from 'native-base';
import { lang } from '../../../../locales';
import { Wallet } from '../../../../entity/Wallet';
import { Blockchain } from '../../../../entity/Blockchain';
import { Title } from '../../../../components/Title';

export type Action = 'create' | 'recover' | 'hd';

export type WalletNewActionSheetProps = {
  /**
   * 是否显示HD钱包创建按钮
   */
  showHDAction?: boolean;
  blockchain?: Blockchain;
  onSelect?: (type: Action) => void;
} & IActionsheetProps;

/**
 * 新钱包创建方式选择
 * 创建/导入
 * @constructor
 */
export function WalletNewActionSheet({ showHDAction, onSelect, ...props }: WalletNewActionSheetProps) {
  function handleNew() {
    onSelect?.('create');
  }

  function handleImport() {
    onSelect?.('recover');
  }

  function handleHD() {
    onSelect?.('hd');
  }

  const titleProps: ITextProps = {
    fontSize: 'md',
  };
  const subtitleProps: ITextProps = {
    fontSize: 'xs',
  };

  return (
    <Actionsheet {...props}>
      <Actionsheet.Content>
        {showHDAction && (
          <Actionsheet.Item onPress={handleHD}>
            <Title
              title={lang('wallet.create.hd')}
              subtitle={lang('wallet.create.hd.describe')}
              titleProps={titleProps}
              subtitleProps={subtitleProps}
            />
          </Actionsheet.Item>
        )}
        <Actionsheet.Item onPress={handleNew}>
          <Title
            title={lang('wallet.create.default')}
            subtitle={lang('wallet.create.default.describe')}
            titleProps={titleProps}
            subtitleProps={subtitleProps}
          />
        </Actionsheet.Item>
        <Actionsheet.Item onPress={handleImport}>
          <Title
            title={lang('wallet.recover.default')}
            subtitle={lang('wallet.recover.default.describe')}
            titleProps={titleProps}
            subtitleProps={subtitleProps}
          />
        </Actionsheet.Item>
        <Actionsheet.Item alignItems="center" onPress={props.onClose}>
          {lang('cancel')}
        </Actionsheet.Item>
      </Actionsheet.Content>
    </Actionsheet>
  );
}
