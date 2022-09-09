import React, { Component } from 'react';
import { autoBind } from 'jsdk/autoBind';
import { observer } from 'mobx-react';
import { Column, FormControl, Input } from 'native-base';
import { lang } from '../../../locales';
import { Page } from '../../../components/Page';
import { Button } from '../../../components/Button';
import { goBack, navigate } from '../../../core/navigation';
import { txService } from '../../../services/blockchain/tx';
import { AccountToken } from '../../../entity/blockchain/wallet-account';
import { tokenService } from '../../../services/blockchain/token';
import { accountAdapter } from '../../../services/blockchain/account-adapter';
import { route } from '../../router';

/**
 * 账户转账
 */
@observer
@autoBind
export class TokenTransfer extends Component<any, any> {
  static options = ({ route }: any) => {
    const { tokenIndex = -1 } = route.params || {};
    const token = tokenService.selectTokens[tokenIndex];
    return {
      title: `${lang('token.send')}(${token?.token?.symbol})`,
      headerBackTitleVisible: false,
    };
  };

  state = {
    toAddress: '',
    value: '',
  };

  constructor(props: any) {
    super(props);
    this.getToken();
  }

  getToken(): AccountToken | undefined {
    const { tokenIndex = -1 } = this.props.route?.params || {};
    const token = tokenService.selectTokens[tokenIndex];
    if (token) {
      return token;
    }
    goBack();
  }

  handleAddressChange(toAddress: string) {
    this.setState({ toAddress: toAddress?.trim() });
  }

  handleNumberValueChange(key: string, value: string) {
    this.setState({ [key]: Number.parseFloat(value?.trim()) });
  }

  handleConfirm() {
    const params = this.props.route?.params || {};

    navigate(route.TokenTransferConfirm, {
      ...params,
      ...this.state,
    });
  }

  isValidAddress() {
    const { toAddress } = this.state;
    return accountAdapter().isAddress(toAddress);
  }

  isValid() {
    const { value } = this.state;
    if (!this.isValidAddress() || Number.parseFloat(value).toString() === 'NaN') {
      return false;
    }
    const { balance = 0 } = this.getToken() ?? {};
    if (value > balance) {
      return false;
    }

    return true;
  }

  render() {
    const { toAddress, value } = this.state;
    const { balance, token } = this.getToken() ?? {};
    const { loading } = txService;
    return (
      <Page loading={loading} loadingText={lang('token.send.pending')}>
        <Column space={5} padding={3}>
          <FormControl isRequired isInvalid={!this.isValidAddress()}>
            <FormControl.Label>{lang('token.receive.address')}</FormControl.Label>
            <Input value={toAddress} onChangeText={this.handleAddressChange} />
            <FormControl.HelperText>{lang(`token.receive.tip`)(token?.symbol)}</FormControl.HelperText>
            <FormControl.ErrorMessage>{lang(`token.receive.address.error`)}</FormControl.ErrorMessage>
          </FormControl>
          <FormControl isRequired>
            <FormControl.Label>{`${lang('token.send.amount')} (${token?.symbol})`}</FormControl.Label>
            <Input value={value} keyboardType="numeric" onChangeText={v => this.handleNumberValueChange('value', v)} />
            <FormControl.HelperText>{`${lang('balance')} ${balance}`}</FormControl.HelperText>
          </FormControl>

          <Button isDisabled={!this.isValid()} isLoading={loading} onPress={this.handleConfirm}>
            {lang('token.send')}
          </Button>
        </Column>
      </Page>
    );
  }
}
