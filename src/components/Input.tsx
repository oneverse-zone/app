import React from 'react';
import { Input as NBInput, IInputProps } from 'native-base';

/**
 * Input
 * @param props 属性
 */
export function Input(props: IInputProps) {
  return <NBInput size="2xl" {...props} />;
}
