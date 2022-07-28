import React from 'react';
import { StyleSheet } from 'react-native';
import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs/lib/typescript/src/types';
import { Box, Center, Pressable, Row, Text, View } from 'native-base';
import { MaterialTopTabBar } from '@react-navigation/material-top-tabs';

/**
 * 紧凑型TabBar
 * @param props
 * @constructor
 */
export function CenterMiniTabBar(props: MaterialTopTabBarProps) {
  return (
    <Box safeAreaTop>
      <MaterialTopTabBar {...props} />
    </Box>
  );
}
