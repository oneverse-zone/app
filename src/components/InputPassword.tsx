import React from 'react';
import { Icon, IInputProps, Input, useDisclose } from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

/**
 * 密码输入Input
 */
export function InputPassword(props: IInputProps) {
  const { isOpen, onToggle } = useDisclose(false);
  return (
    <Input
      size="2xl"
      {...props}
      type={isOpen ? 'text' : 'password'}
      InputRightElement={
        <Icon
          as={<MaterialIcons name={isOpen ? 'visibility' : 'visibility-off'} />}
          size={5}
          mr="2"
          color="muted.400"
          onPress={onToggle}
        />
      }
    />
  );
}
