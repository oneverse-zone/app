import React, { ReactNode } from 'react';
import { ChevronRightIcon, Pressable, Row, Spacer } from 'native-base';
import { Title, TitleProps } from './Title';

export type ListItemProps = {
  icon?: ReactNode;
  footer?: ReactNode;

  showArrow?: boolean;

  onPress?: () => void;
} & TitleProps;

/**
 * 普通list条目渲染组件
 */
export function ListItem(props: ListItemProps) {
  const { icon, title, titleProps, subtitle, showArrow = true, onPress, footer } = props;

  return (
    <Pressable onPress={onPress}>
      <Row backgroundColor="white" padding={3} space={3} alignItems="center">
        {icon}
        <Title title={title} titleProps={titleProps} subtitle={subtitle} />
        <Spacer />
        {footer}
        {showArrow && <ChevronRightIcon fill="#9ca3af" />}
      </Row>
    </Pressable>
  );
}
