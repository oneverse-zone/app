import React from 'react';
import { Icon, ITextProps, Text, Toast } from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Clipboard from '@react-native-clipboard/clipboard';
import { lang } from '../locales';

export type AddressTextProps = { address: string } & ITextProps;

export function AddressText({ address, ...props }: AddressTextProps) {
  function handleCopy() {
    Clipboard.setString(address ?? '');
    Toast.show({
      placement: 'top',
      description: lang('copy.success'),
    });
  }

  return (
    <Text ellipsizeMode="middle" numberOfLines={1} width={100.001} onPress={handleCopy} {...props}>
      {address}
      <Icon color={props.color} size={props.fontSize} as={<MaterialIcons name="content-copy" />} marginLeft={3} />
    </Text>
  );
}
