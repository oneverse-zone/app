import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { Column, FormControl, TextArea } from 'native-base';
import { sessionService } from '../../../services/Session';
import { Page } from '../../../components/Page';
import { goBack, resetTo } from '../../../core/navigation';
import { route } from '../../router';
import { PageTitle } from '../../../components/PageTitle';
import { lang } from '../../../locales';
import { Button } from '../../../components/Button';
import { InputPassword } from '../../../components/InputPassword';

/**
 * 导入身份
 */
export const ImportIdentify = observer(function ImportIdentify(props: any) {
  useEffect(() => {
    const { password } = props.route?.params || {};
    // 密码不存在返回上一页
    if (!password) {
      goBack();
    }
  }, []);

  const [mnemonic, setMnemonic] = useState(
    'genre bargain kind identify wife scan bachelor search dinner tide write patrol',
  );
  const [pwd, setPwd] = useState('');

  const { loading } = sessionService;

  async function handleImport() {
    const { password } = props.route?.params || {};
    await sessionService.importAndLogin(password, mnemonic, pwd);
    resetTo(route.Home);
  }

  return (
    <Page paddingX={9} space={5} Root={Column}>
      <PageTitle title={lang('identify.import')} />
      <FormControl isRequired>
        <FormControl.Label>{lang('mnemonic')}</FormControl.Label>
        <TextArea
          autoCompleteType="off"
          size="lg"
          onChangeText={v => setMnemonic(v)}
          autoCapitalize="none"
          value={mnemonic}
        />
      </FormControl>
      <FormControl>
        <FormControl.Label>{lang('mnemonic.password')}</FormControl.Label>
        <InputPassword onChangeText={v => setPwd(v)} />
      </FormControl>

      <Button isDisabled={!mnemonic} isLoading={loading} onPress={handleImport}>
        {lang('identify.import')}
      </Button>
    </Page>
  );
});

(ImportIdentify as any).options = {
  title: lang('app.name'),
  headerBackTitleVisible: false,
  headerShadowVisible: false,
};
