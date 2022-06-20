import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { Button, Column, Input, TextArea } from 'native-base';
import { sessionService } from '../../services/Session';
import { Page } from '../../components/Page';
import { navigate, resetTo } from '../../core/navigation';
import { route } from '../router';

/**
 * 导入身份
 */
export const ImportIdentify = observer(function Login() {
  const [mnemonic, setMnemonic] = useState(
    'matrix tiny service cry elbow gadget tooth when spy bottom soup pill faith drift dragon comfort science wreck despair crunch upset quarter strike code',
  );
  const [password, setPassword] = useState('1');

  const { loading } = sessionService;

  async function handleLogin() {
    await sessionService.login(mnemonic, password);
    resetTo(route.Home);
  }

  function handleRegister() {
    navigate(route.RegisterOne);
  }

  return (
    <Page flex={1} justifyContent="center" loading={loading} Root={Column} space={3.5} padding={3}>
      <TextArea
        autoCompleteType="off"
        size="lg"
        placeholder="请输入您的助记词"
        onChangeText={v => setMnemonic(v)}
        autoCapitalize="none"
        value={mnemonic}
      />
      <Input
        size="lg"
        type="password"
        placeholder="请输入您的助记词密码"
        onChangeText={v => setPassword(v)}
        value={password}
      />
      <Button disabled={loading} onPress={handleLogin}>
        {'立即登录'}
      </Button>
      <Button variant="ghost" onPress={handleRegister}>
        {'创建一个去中心化身份'}
      </Button>
    </Page>
  );
});

(ImportIdentify as any).options = {
  headerShown: false,
};
