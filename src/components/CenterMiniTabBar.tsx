import React from 'react';
import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs/lib/typescript/src/types';
import { Box, Center, Text } from 'native-base';
import { MaterialTopTabBar } from '@react-navigation/material-top-tabs';

/**
 * 紧凑型TabBar
 * @param props
 * @constructor
 */
export function CenterMiniTabBar(props: MaterialTopTabBarProps) {
  return (
    <Center borderWidth={1} height={50} borderColor="blue.500" bgColor="">
      <Text>1</Text>
      <MaterialTopTabBar {...props} />
    </Center>
  );
}
