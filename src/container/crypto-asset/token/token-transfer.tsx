import React, { Component } from 'react';
import { autoBind } from 'jsdk/autoBind';
import { observer } from 'mobx-react';
import { Column, FormControl, Input, TextArea } from 'native-base';
import { lang } from '../../../locales';
import { Page } from '../../../components/Page';
import { Button } from '../../../components/Button';
import { goBack } from '../../../core/navigation';
import { walletManagerService } from '../../../services/blockchain/wallet-manager';
import { txService } from '../../../services/blockchain/tx';
import { AccountToken } from '../../../entity/blockchain/wallet-account';

/**
 * 账户转账
 */
@observer
@autoBind
export class TokenTransfer extends Component<any, any> {
  static options = {
    title: lang('token.send'),
    headerBackTitleVisible: false,
  };

  state = {
    accountIndex: -1,
    tokenIndex: -1,

    toAddress: '',
    value: '',
    gasPrice: '0',
    gasLimit: '0',
    speed: 0.5,
    balance: '',
  };

  constructor(props: any) {
    super(props);
    const { accountIndex, tokenIndex } = props.route?.params;
    if (accountIndex === undefined || tokenIndex === undefined) {
      goBack();
      return;
    }
    this.state.accountIndex = accountIndex;
    this.state.tokenIndex = tokenIndex;
    this.updateGas();
  }

  getAccount() {
    const accounts = walletManagerService.selected?.accounts ?? [];
    const account = accounts[this.state.accountIndex];
    if (account) {
      return account;
    }
    goBack();
  }

  getToken(): AccountToken | undefined {
    const account = this.getAccount();
    if (!account) {
      return;
    }
    const token = account.tokens[this.state.tokenIndex];
    if (token) {
      return token;
    }
    goBack();
  }

  async updateGas() {
    // const token: WalletToken = this.getToken();
    // const data = await walletAdapter.e;
    // console.log(data);
    // this.setState(data);
  }

  async handleSend() {
    // const token = this.props.route?.params;
    const { toAddress, value, gasPrice, gasLimit } = this.state;
    // await walletService.sendTransaction(token, toAddress, value, gasPrice, gasLimit);
  }

  handleAddressChange(toAddress: string) {
    this.setState({ toAddress: toAddress?.trim() });
  }

  handleNumberValueChange(key: string, value: string) {
    this.setState({ [key]: Number.parseFloat(value?.trim()) });
  }

  handleSpeedChange(value: any) {
    console.log(value);
  }

  isValid() {
    const { toAddress, value, gasPrice, gasLimit } = this.state;
    if (!toAddress || !value || !gasPrice || !gasLimit) {
      return false;
    }
    return true;
  }

  render() {
    const { balance, gasPrice, gasLimit } = this.state;
    const { loading } = txService;
    return (
      <Page>
        <Column space={5} padding={3}>
          <FormControl>
            <FormControl.Label>{lang('token.receive.address')}</FormControl.Label>
            <TextArea autoCompleteType="" onChangeText={this.handleAddressChange} />
          </FormControl>
          <FormControl>
            <FormControl.Label>{lang('token.send.amount')}</FormControl.Label>
            <Input keyboardType="numeric" onChangeText={v => this.handleNumberValueChange('value', v)} />
            <FormControl.HelperText>{`${lang('balance')} ${balance}`}</FormControl.HelperText>
          </FormControl>
          <FormControl>
            <FormControl.Label>{`${lang('gas.price')} (${lang('gas.eth.unit.gwei')})`}</FormControl.Label>
            <Input
              value={gasPrice}
              keyboardType="numeric"
              onChangeText={v => this.handleNumberValueChange('gasPrice', v)}
            />
            <FormControl.HelperText>{lang('gas.price.describe')}</FormControl.HelperText>
          </FormControl>
          <FormControl>
            <FormControl.Label>{lang('gas.limit')}</FormControl.Label>
            <Input
              value={gasLimit}
              keyboardType="numeric"
              onChangeText={v => this.handleNumberValueChange('gasLimit', v)}
            />
            <FormControl.HelperText>{lang('gas.limit.describe')}</FormControl.HelperText>
          </FormControl>
          <Button isDisabled={!this.isValid() || loading} isLoading={loading} onPress={this.handleSend}>
            {lang('token.send')}
          </Button>
        </Column>
      </Page>
    );
  }
}
