import React, {Component} from 'react';
import {Page} from '../../components/Page';
import {
  Button,
  Column,
  FormControl,
  Input,
  WarningOutlineIcon,
} from 'native-base';
import {autoBind} from 'jsdk/autoBind';
import {replace} from '../../core/navigation';
import {route} from '../router';

/**
 * 注册第一步
 */
@autoBind
export class RegisterOne extends Component<any, any> {
  state = {
    password: '',
    error: null,
  };

  handlePasswordChange(password: string) {
    this.setState({
      password,
    });
  }

  handleConfirmPasswordChange(password: string) {
    const error =
      this.state.password === password ? null : '两次输入的密码不一致';
    this.setState({error});
  }

  handleRegister() {
    if (this.state.error) {
      return;
    }
    replace(route.RegisterTwo, {password: this.state.password});
  }

  render() {
    const {error} = this.state;
    return (
      <Page padding={3} space={3.5} Root={Column}>
        <FormControl>
          <FormControl.Label>{'密码'}</FormControl.Label>
          <Input
            size="lg"
            type="password"
            placeholder="请输入您的助记词密码"
            onChangeText={this.handlePasswordChange}
          />
        </FormControl>

        <FormControl isInvalid={!!error}>
          <FormControl.Label>{'确认密码'}</FormControl.Label>
          <Input
            size="lg"
            type="password"
            placeholder="请输入您的助记词密码"
            onChangeText={this.handleConfirmPasswordChange}
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {error}
          </FormControl.ErrorMessage>
        </FormControl>
        <Button onPress={this.handleRegister}>{'立即注册'}</Button>
      </Page>
    );
  }
}
