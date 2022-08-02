import { Icon, IInputProps, Input } from 'native-base';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export type SearchBarProps = {} & IInputProps;

export function SearchBar({ ...props }: SearchBarProps) {
  return (
    <Input
      width="100%"
      borderRadius="full"
      fontSize="14"
      InputLeftElement={<Icon m="2" ml="3" size="6" color="gray.400" as={<MaterialIcons name="search" />} />}
      // InputRightElement={<Icon m="2" mr="3" size="6" color="gray.400" as={<MaterialIcons name="mic" />} />}
      {...props}
    />
  );
}
