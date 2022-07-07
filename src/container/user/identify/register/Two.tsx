import React, { Component } from 'react';
import { autoBind } from 'jsdk/autoBind';
import { observer } from 'mobx-react';

import { Button, Column, FormControl, Radio, Row } from 'native-base';
import { lang } from '../../../../locales';
import { InputPassword } from '../../../../components/InputPassword';
import { sessionService } from '../../../../services/Session';
import { goBack, resetTo } from '../../../../core/navigation';
import { Page } from '../../../../components/Page';
import { PageTitle } from '../../../../components/PageTitle';
import { route } from '../../../router';

@observer
@autoBind
export class RegisterTwo extends Component<any, any> {
  static options = {
    title: lang('app.name'),
    headerBackTitleVisible: false,
    headerShadowVisible: false,
  };

  state = {
    mnemonicLength: '12',
    password: '',
  };

  constructor(props: any) {
    super(props);
    const { password } = this.props.route?.params || {};
    // 密码不存在返回上一页
    if (!password) {
      goBack();
    }
  }

  createChangeFunc(name: string) {
    return (v: any) => this.setState({ [name]: v });
  }

  async handleRegister() {
    const { password } = this.props.route?.params || {};
    const { mnemonicLength, password: mnemonicPassword } = this.state;
    await sessionService.registerAndLogin(password, parseInt(mnemonicLength), mnemonicPassword);
    resetTo(route.AccountBackup);
  }

  valid() {
    const { password } = this.state;
    if (password && password.length < 8) {
      return false;
    }
    return true;
  }

  render() {
    const { loading } = sessionService;
    const { mnemonicLength } = this.state;

    return (
      <Page loading={loading} paddingX={9} Root={Column} space={5}>
        <PageTitle title={lang('mnemonic.setting')} description={lang('mnemonic.setting.tip')} />

        {/*助记词个数*/}
        <FormControl isRequired>
          <FormControl.Label>{lang('mnemonic.length')}</FormControl.Label>
          <Radio.Group name="mnemonicLength" value={mnemonicLength} onChange={this.createChangeFunc('mnemonicLength')}>
            <Row space={3}>
              <Radio value="12">12</Radio>
              <Radio value="24">24</Radio>
            </Row>
          </Radio.Group>
        </FormControl>
        {/*助记词密码*/}
        <FormControl>
          <FormControl.Label>{lang('mnemonic.password')}</FormControl.Label>
          <InputPassword onChangeText={this.createChangeFunc('password')} />
          <FormControl.HelperText>{lang('mnemonic.password.tip')}</FormControl.HelperText>
        </FormControl>

        <Button isDisabled={!this.valid()} onPress={this.handleRegister}>
          {lang('next-step')}
        </Button>
      </Page>
    );
  }
}
