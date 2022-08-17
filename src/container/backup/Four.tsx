import React from 'react';
import { Center, Column, Icon, Text } from 'native-base';
import { Page } from '../../components/Page';
import { PageTitle } from '../../components/PageTitle';
import { lang } from '../../locales';
import { Button } from '../../components/Button';
import { resetTo } from '../../core/navigation';
import { route } from '../router';

export function BackupFour() {
  function handleFinish() {
    resetTo(route.Home);
  }

  return (
    <Page Root={Column} space={5} paddingX={8}>
      <Center>
        <Text fontSize="6xl">{'🎉'}</Text>
      </Center>
      <PageTitle title={lang('congratulations')} description={lang('backup.four.describe')} />
      <Text textAlign="center" paddingX={3}>
        {lang('backup.four.tip')}
      </Text>
      <Button onPress={handleFinish}>{lang('finish')}</Button>
    </Page>
  );
}

BackupFour.options = {
  title: lang('app.name'),
  headerBackTitleVisible: false,
  headerShadowVisible: false,
};
