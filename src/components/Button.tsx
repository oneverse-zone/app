import React from 'react';
import { Button as NButton, IButtonProps } from 'native-base';

/**
 * 按钮
 * @constructor
 */
export function Button(props: IButtonProps) {
  return <NButton rounded="full" size="lg" {...props} />;
}
