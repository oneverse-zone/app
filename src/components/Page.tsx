import React, { PropsWithChildren, ReactNode } from 'react';
import { Box, Center, IBoxProps, IScrollViewProps, Modal, ScrollView, Spinner, Text } from 'native-base';
import { IVStackProps } from 'native-base/lib/typescript/components/primitives/Stack/VStack';
import { IHStackProps } from 'native-base/lib/typescript/components/primitives/Stack/HStack';
import { IKeyboardAvoidingViewProps } from 'native-base/lib/typescript/components/basic/KeyboardAvoidingView/types';
import { RefreshControl } from 'react-native';

export type PageProps = {
  loading?: boolean;
  loadingText?: string;
  refreshing?: boolean;
  onRefresh?: () => void;
  Root?: any;
  header?: ReactNode;
  footer?: ReactNode;
  scroll?: boolean | IScrollViewProps;
} & (IBoxProps | IVStackProps | IHStackProps | IKeyboardAvoidingViewProps);

export function Page({
  Root = Box,
  loading,
  loadingText = '正确处理中...',
  header,
  children,
  footer,
  scroll = true,
  refreshing = false,
  onRefresh,
  ...props
}: PropsWithChildren<PageProps>) {
  const root = (
    <Root flex={1} {...props}>
      {children}
    </Root>
  );

  return (
    <>
      {header}
      {scroll ? (
        <ScrollView
          flex={1}
          contentContainerStyle={{ height: '100%' }}
          backgroundColor="white"
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          {...(typeof scroll === 'boolean' ? {} : scroll)}>
          {root}
        </ScrollView>
      ) : (
        root
      )}
      {footer}
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
    </>
  );
}
