import React, { PropsWithChildren } from 'react';
import { Box, Center, IBoxProps, Modal, Spinner, Text } from 'native-base';
import { IVStackProps } from 'native-base/lib/typescript/components/primitives/Stack/VStack';

export type PageProps = {
  loading?: boolean;
  loadingText?: string;
  Root?: any;
} & IBoxProps &
  IVStackProps;

export function Page({
  Root = Box,
  loading,
  loadingText = '正确处理中...',
  children,
  ...props
}: PropsWithChildren<PageProps>) {
  return (
    <Root flex={1} backgroundColor="white" {...props}>
      {children}
      <Modal isOpen={loading} justifyContent="center" alignItems="center">
        <Modal.Content width="130" minH="120">
          <Center backgroundColor="rgba(0,0,0,0.611)" flex={1}>
            <Spinner color="#FFF" />
            <Text color="#FFF" marginTop={3}>
              {loadingText}
            </Text>
          </Center>
        </Modal.Content>
      </Modal>
    </Root>
  );
}
