import { Icon, ITextProps, Text, Toast } from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import React from 'react';
import Clipboard from '@react-native-clipboard/clipboard';
import { lang } from '../locales';

export type CopyTextProps = ITextProps & {
  showIcon?: boolean;
  children: string;
};

/**
 * 可复制文本
 * @constructor
 */
export function CopyText({ showIcon, children, ...props }: CopyTextProps) {
  function handleCopy() {
    Clipboard.setString(children ?? '');
    Toast.show({
      placement: 'top',
      description: lang('copy.success'),
    });
  }

  return (
    <Text ellipsizeMode="middle" numberOfLines={1} width={100.001} onPress={handleCopy} {...props}>
      {children}
      {showIcon && (
        <Icon color={props.color} size={props.fontSize} as={<MaterialIcons name="content-copy" />} marginLeft={3} />
      )}
    </Text>
  );
}
