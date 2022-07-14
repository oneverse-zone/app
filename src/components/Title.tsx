import React, { ReactNode } from 'react';
import { Column, ITextProps, Text } from 'native-base';

export type TitleProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  titleProps?: ITextProps;
};

/**
 * 标题组件
 */
export function Title({ title, titleProps, subtitle }: TitleProps) {
  return (
    <Column>
      {title && (
        <Text fontSize="lg" {...titleProps}>
          {title}
        </Text>
      )}
      {subtitle && <Text fontSize="sm">{subtitle}</Text>}
    </Column>
  );
}
