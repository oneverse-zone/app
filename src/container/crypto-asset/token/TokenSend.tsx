import React, { Component } from 'react';
import { autoBind } from 'jsdk/autoBind';
import { observer } from 'mobx-react';
import { Column, FormControl, Input, Row, Slider, TextArea } from 'native-base';
import { lang } from '../../../locales';
import { Page } from '../../../components/Page';
import { Button } from '../../../components/Button';
import { walletService } from '../../../services/wallet-manager';
import { WalletToken } from '../../../entity/blockchain/wallet';
import { goBack } from '../../../core/navigation';

/**
 * token 转出
 */
@observer
@autoBind
export class TokenSend extends Component<any, any> {
  static options = {
    title: lang('token.send'),
    headerBackTitleVisible: false,
  };
  state = {
    toAddress: '',
    value: '',
    gasPrice: '0',
    gasLimit: '0',
    speed: 0.5,
    balance: '',
  };

  constructor(props: any) {
    super(props);
    const token: WalletToken = props.route?.params;
    if (!token) {
      goBack();
      return;
    }
    this.state.balance = `${token.balance}`;
    this.updateBalance();
    this.updateGas();
  }

  async updateBalance() {
    const token: WalletToken = this.props.route?.params;
    const balance = await walletService.getBalance(token);
    this.setState({ balance });
  }

  async updateGas() {
    const token: WalletToken = this.props.route?.params;
    const data = await walletService.estimateGasInfo(token);
    console.log(data);
    this.setState(data);
  }

  async handleSend() {
    const token: WalletToken = this.props.route?.params;
    const { toAddress, value, gasPrice, gasLimit } = this.state;
    await walletService.sendTransaction(token, toAddress, value, gasPrice, gasLimit);
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
    const { loading } = walletService;
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
