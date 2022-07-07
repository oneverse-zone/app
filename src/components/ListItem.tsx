import React, { ReactNode } from 'react';
import { ChevronRightIcon, Column, ITextProps, Pressable, Spacer, Text } from 'native-base';

export type ListItemProps = {
  icon?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  showArrow?: boolean;

  titleProps?: ITextProps;

  onPress?: () => void;
};

/**
 * 普通list条目渲染组件
 */
export function ListItem(props: ListItemProps) {
  const { icon, title, titleProps, subtitle, showArrow = true, onPress } = props;

  return (
    <Pressable backgroundColor="white" padding={3} flexDirection="row" alignItems="center" onPress={onPress}>
      {icon}
      <Column>
        {title && <Text {...titleProps}>{title}</Text>}
        {subtitle && <Text>{subtitle}</Text>}
      </Column>
      <Spacer />
      {showArrow && <ChevronRightIcon fill="coolGray.400" />}
    </Pressable>
  );
}
