import { Center, Heading, Text } from 'native-base';
import React, { ReactNode } from 'react';

export type PageTitleProps = {
  title: ReactNode;
  description?: ReactNode;
};

/**
 * 页面标题组件
 * @param title 大标题
 * @param description 说明
 * @constructor
 */
export function PageTitle({ title, description }: PageTitleProps) {
  return (
    <Center>
      <Heading>{title}</Heading>
      <Text textAlign="center" mt={7} paddingX={3}>
        {description}
      </Text>
    </Center>
  );
}
