import React, { Component, createRef } from 'react';
import { autoBind } from 'jsdk/autoBind';
import { AlertDialog, Spacer, Button as NButton, Column, Text } from 'native-base';
import { Page } from '../../../../components/Page';
import { PageTitle } from '../../../../components/PageTitle';
import { lang } from '../../../../locales';
import { Button } from '../../../../components/Button';
import { navigate, resetTo } from '../../../../core/navigation';
import { route } from '../../../router';
import { MnemonicAlert } from './MnemonicAlert';

/**
 * 帐户备份
 */
@autoBind
export class BackupOne extends Component<any, any> {
  static options = {
    title: lang('app.name'),
    headerBackTitleVisible: false,
    headerShadowVisible: false,
  };
  state = {
    open: false,
  };

  openSwitch() {
    this.setState({ open: !this.state.open });
  }

  handleLater() {
    resetTo(route.Home);
  }

  handleStart() {
    navigate(route.BackupTwo);
  }

  render() {
    const { open } = this.state;
    return (
      <Page paddingX={4} Root={Column} space={5}>
        <PageTitle title={lang('protect-your-account-safe')} />
        <Text alignItems="center">
          {'不要冒失丢帐户、资产的风险。在您信任的地方保存您的'}
          <NButton variant="link" padding={0} marginBottom={-0.49} alignItems="center" onPress={this.openSwitch}>
            {lang('mnemonic')}
          </NButton>
          {',以此保护您的帐户和资产。'}
          <Text bold>{'如果您被应用锁定或换新设备,这是找回帐户的唯一途径。'}</Text>
        </Text>
        <Spacer />
        <Button variant="ghost" onPress={this.handleLater}>
          {'稍后提醒我'}
          <Text textAlign="center" color="gray.500" fontSize="xs">
            {'(不建议)'}
          </Text>
        </Button>
        <Button onPress={this.handleStart}>{'开始'}</Button>
        <Text textAlign="center" color="gray.500" fontSize="xs">
          {'强烈建议'}
        </Text>
        <MnemonicAlert open={open} onClose={this.openSwitch} />
      </Page>
    );
  }
}
