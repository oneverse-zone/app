import React, { useEffect } from 'react';
import { Center, Text } from 'native-base';
import SS from 'react-native-splash-screen';
import { resetTo } from '../core/navigation';
import { route } from './router';
import { hasUserSetPinCode } from '@haskkor/react-native-pincode';
import { observer } from 'mobx-react';
import { sessionService } from '../services/Session';

export const Splash: React.FC<any> = observer(function Splash() {
  useEffect(() => {
    check();
  }, []);

  const { locked, authenticated } = sessionService;

  /**
   * 启动检查
   */
  async function check() {
    const hasPinCode = await hasUserSetPinCode();
    if (!locked && !authenticated) {
      console.log('用户已经解锁,但是用户未授权,跳转到Start页面');
      resetTo(route.Start);
    } else if (hasPinCode) {
      console.log('设备未解锁,但是用户设置了pin,跳转到PinCode页面');
      resetTo(route.PinCode);
    } else {
      console.log('设备未解锁，用户未设置pin,跳转到启动页面');
      resetTo(route.OnBoarding);
    }

    SS.hide();
  }

  return (
    <Center flex={1}>
      <Text>{'欢迎来到 OneVerse'}</Text>
      <Text>{'您将主宰自己的一切'}</Text>
    </Center>
  );
});

(Splash as any).options = { headerShown: false };
