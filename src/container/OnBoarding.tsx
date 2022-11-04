import React, { useEffect } from 'react';
import { route } from '../core/route.config';
import { View } from 'react-native';
import { resetTo } from '../core/navigation';

/**
 * 启动屏幕
 * 引导、介绍
 */
export function OnBoarding() {
  useEffect(() => {
    resetTo(route.Start);
  }, []);

  return <View />;
}
