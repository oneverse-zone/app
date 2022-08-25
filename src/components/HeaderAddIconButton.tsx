import { AddIcon, IconButton } from 'native-base';
import React from 'react';

export type HeaderAddIconButtonProps = {
  onPress?: () => void;
};

/**
 * 头部新增按钮
 * @constructor
 */
export function HeaderAddIconButton({ onPress }: HeaderAddIconButtonProps) {
  // const { colors } = useTheme();
  return <IconButton borderRadius="full" icon={<AddIcon />} onPress={onPress} />;
}
