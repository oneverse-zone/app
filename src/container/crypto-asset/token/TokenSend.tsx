import React, { Component } from 'react';
import { autoBind } from 'jsdk/autoBind';
import { observer } from 'mobx-react';
import { FormControl, Input, TextArea } from 'native-base';
import { lang } from '../../../locales';
import { Page } from '../../../components/Page';
import { Button } from '../../../components/Button';
import { walletService } from '../../../services/Wallet';
import { WalletToken } from '../../../entity/Wallet';

/**
 * token 转出
 */
@observer
@autoBind
export class TokenSend extends Component<any, any> {
  state = {
    toAddress: '',
    value: '',
  };

  handleSend() {
    const token: WalletToken = this.props.route?.params;
    const { toAddress, value } = this.state;
    walletService.tx(token, toAddress, value);
  }

  handleAddressChange(toAddress: string) {
    this.setState({ toAddress: toAddress?.trim() });
  }

  handleValueChange(value: string) {
    this.setState({ value: Number.parseFloat(value?.trim()) });
  }

  isValid() {
    const { toAddress, value } = this.state;
    if (!toAddress || !value) {
      return false;
    }
    return true;
  }

  render() {
    return (
      <Page padding={3}>
        <FormControl>
          <FormControl.Label>{lang('token.receive.address')}</FormControl.Label>
          <TextArea autoCompleteType="" onChangeText={this.handleAddressChange} />
        </FormControl>
        <FormControl>
          <FormControl.Label>{lang('token.send.amount')}</FormControl.Label>
          <Input keyboardType="numeric" onChangeText={this.handleValueChange} />
        </FormControl>
        <FormControl>
          <FormControl.Label>{lang('gas')}</FormControl.Label>
        </FormControl>
        <Button isDisabled={!this.isValid()} onPress={this.handleSend}>
          {lang('token.send')}
        </Button>
      </Page>
    );
  }
}
