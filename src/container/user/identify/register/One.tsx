import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Column, FormControl } from 'native-base';
import { autoBind } from 'jsdk/autoBind';
import { Page } from '../../../../components/Page';
import { lang } from '../../../../locales';
import { InputPassword } from '../../../../components/InputPassword';
import { sessionService } from '../../../../services/Session';
import { PageTitle } from '../../../../components/PageTitle';
import { route } from '../../../router';
import { navigate } from '../../../../core/navigation';
import { Button } from '../../../../components/Button';

/**
 * 注册第一步
 */
@observer
@autoBind
export class RegisterOne extends Component<any, any> {
  static options = {
    title: lang('app.name'),
    headerBackTitleVisible: false,
    headerShadowVisible: false,
  };

  state = {
    password: '',
    passwordConfirm: '',
  };

  createChangeFunc(name: string) {
    return (v: any) => this.setState({ [name]: v });
  }

  async handleNext() {
    if (!this.valid()) {
      return;
    }
    const { password } = this.state;
    navigate(route.RegisterTwo, { password });
  }

  valid() {
    const { password, passwordConfirm } = this.state;
    return !(!password || !passwordConfirm || password !== passwordConfirm || password.length < 8);
  }

  render() {
    const { loading } = sessionService;
    return (
      <Page paddingX={9} space={5} Root={Column}>
        <PageTitle title={lang('device.password.create')} description={lang('device.password.tip')} />

        <FormControl isRequired>
          <FormControl.Label>{lang('password.new')}</FormControl.Label>
          <InputPassword onChangeText={this.createChangeFunc('password')} />
        </FormControl>
        <FormControl isRequired>
          <FormControl.Label>{lang('password.confirm')}</FormControl.Label>
          <InputPassword onChangeText={this.createChangeFunc('passwordConfirm')} />
          <FormControl.HelperText>{lang('device.password.require')}</FormControl.HelperText>
        </FormControl>

        <Button isDisabled={!this.valid()} onPress={this.handleNext} isLoading={loading}>
          {lang('next-step')}
        </Button>
      </Page>
    );
  }
}
