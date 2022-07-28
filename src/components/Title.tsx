import React, { ReactNode } from 'react';
import { Column, ITextProps, Text } from 'native-base';

export type TitleProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  titleProps?: ITextProps;
  subtitleProps?: ITextProps;
};

/**
 * 标题组件
 */
export function Title({ title, titleProps, subtitle, subtitleProps }: TitleProps) {
  return (
    <Column>
      {title && (
        <Text fontSize="lg" {...titleProps}>
          {title}
        </Text>
      )}
      {subtitle && (
        <Text fontSize="sm" {...subtitleProps}>
          {subtitle}
        </Text>
      )}
    </Column>
  );
}
