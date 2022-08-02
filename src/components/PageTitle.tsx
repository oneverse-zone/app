import { Center, Heading, ICenterProps, Text } from 'native-base';
import React, { ReactNode } from 'react';

export type PageTitleProps = {
  title: ReactNode;
  description?: ReactNode;
} & ICenterProps;

/**
 * 页面标题组件
 * @param title 大标题
 * @param description 说明
 * @constructor
 */
export function PageTitle({ title, description, ...props }: PageTitleProps) {
  return (
    <Center {...props}>
      <Heading>{title}</Heading>
      <Text textAlign="center" mt={7} paddingX={3}>
        {description}
      </Text>
    </Center>
  );
}
