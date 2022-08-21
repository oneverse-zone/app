import React, { ReactNode } from 'react';
import { ChevronRightIcon, Pressable, Row, Spacer } from 'native-base';
import { Title, TitleProps } from './Title';
import { IHStackProps } from 'native-base/lib/typescript/components/primitives/Stack/HStack';

export type ListItemProps = {
  icon?: ReactNode;
  footer?: ReactNode;

  showArrow?: boolean;

  onPress?: () => void;
} & TitleProps &
  IHStackProps;

/**
 * 普通list条目渲染组件
 */
export function ListItem(props: ListItemProps) {
  const { icon, title, titleProps, subtitle, subtitleProps, showArrow = true, onPress, footer, ...other } = props;

  return (
    <Pressable onPress={onPress}>
      <Row backgroundColor="white" padding={3} space={3} alignItems="center" {...other}>
        {icon}
        <Title title={title} titleProps={titleProps} subtitle={subtitle} subtitleProps={subtitleProps} />
        <Spacer />
        {footer}
        {showArrow && <ChevronRightIcon fill="#9ca3af" />}
      </Row>
    </Pressable>
  );
}
