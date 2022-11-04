import React, { Component } from 'react';
import { autoBind } from 'jsdk/autoBind';
import { Button as NButton, Column, Spacer, Text } from 'native-base';
import { Page } from '../../components/Page';
import { PageTitle } from '../../components/PageTitle';
import { lang } from '../../locales';
import { Button } from '../../components/Button';
import { goBack, navigate, resetTo } from '../../core/navigation';
import { route } from '../../core/route.config';
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
    const { type = 'account' } = this.props.route.params || {};
    if (type === 'account') {
      resetTo(route.Home);
    } else {
      goBack();
    }
  }

  handleStart() {
    navigate(route.BackupTwo, this.props.route.params);
  }

  render() {
    const { open } = this.state;
    const { type = 'account' } = this.props.route.params || {};
    return (
      <Page paddingX={4} Root={Column} space={5} safeAreaBottom>
        <PageTitle title={lang(`protect-your-${type}-safe` as any)} />
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
        <Button onPress={this.handleStart}>{'立即备份'}</Button>
        <Text textAlign="center" color="gray.500" fontSize="xs">
          {'强烈建议'}
        </Text>
        <MnemonicAlert open={open} onClose={this.openSwitch} />
      </Page>
    );
  }
}
