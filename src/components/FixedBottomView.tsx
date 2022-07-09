import React, { PropsWithChildren } from 'react';
import { Box, IBoxProps } from 'native-base';

export type FixedBottomViewProps = {} & IBoxProps;

/**
 * 固定底部
 */
export function FixedBottomView({ children, ...props }: PropsWithChildren<FixedBottomViewProps>) {
  return (
    <Box position="absolute" left={0} right={0} bottom={0} padding={3} backgroundColor="#FFF" safeAreaBottom {...props}>
      {children}
    </Box>
  );
}
