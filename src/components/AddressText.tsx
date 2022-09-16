import React from 'react';
import { CopyText, CopyTextProps } from './CopyText';

export type AddressTextProps = { address: string } & CopyTextProps;

export function AddressText({ address, ...props }: Omit<AddressTextProps, 'children'>) {
  return <CopyText children={address} {...props} />;
}
