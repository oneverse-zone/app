import React, { Component } from 'react';
import { autoBind } from 'jsdk/autoBind';
import { observer } from 'mobx-react';
import { Column, FormControl, Input } from 'native-base';
import { lang } from '../../../locales';
import { Page } from '../../../components/Page';
import { Button } from '../../../components/Button';
import { goBack } from '../../../core/navigation';
import { txService } from '../../../services/blockchain/tx';
import { FullToken } from '../../../entity/blockchain/wallet-account';
import { tokenService } from '../../../services/blockchain/token';
import { walletManagerService } from '../../../services/blockchain/wallet-manager';
import { gasService } from '../../../services/blockchain/gas';
import { GasCard } from '../components/gas-card';
import { accountAdapter } from '../../../services/blockchain/account-adapter';

const MAX_QUERY_GAS_COUNT = 50;

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
    toAddress: '',
    value: '',
    gasLimit: '21000',
  };
  timer?: NodeJS.Timer;
  queryGasCount = 1;

  constructor(props: any) {
    super(props);
    const token = this.getToken();
    token &&
      props.navigation.setOptions({
        title: token.symbol,
      });
    this.updateGas();
    this.timer = setInterval(this.updateGas, 1000 * 30);
  }

  componentWillUnmount() {
    this.timer && clearInterval(this.timer);
    this.timer = undefined;
  }

  getToken(): FullToken | undefined {
    const { tokenIndex = -1 } = this.props.route?.params || {};
    const token = tokenService.selectTokens[tokenIndex];
    if (token) {
      return token;
    }
    goBack();
  }

  updateGas() {
    if (this.queryGasCount > MAX_QUERY_GAS_COUNT) {
      this.timer && clearInterval(this.timer);
      this.timer = undefined;
      return;
    }
    const { selectedAccount } = walletManagerService;
    const token = this.getToken();
    if (!token || !selectedAccount) {
      return;
    }
    gasService.update();
  }

  async handleSend() {
    const { selected, selectedAccount } = walletManagerService;
    const token = this.getToken();
    if (!token || !selectedAccount || !selected) {
      return;
    }
    const gasInfo = gasService.selected;
    if (!gasInfo) {
      console.log(`无法获取gas费信息 ${selectedAccount.blockchainId}`);
      return;
    }

    const { toAddress, value } = this.state;
    await txService.send({
      wallet: selected,
      account: selectedAccount,
      token,
      to: toAddress,
      value,
      gasInfo,
    });
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

  isValidAddress() {
    const { toAddress } = this.state;
    return accountAdapter().isAddress(toAddress);
  }

  isValid() {
    const { value, gasLimit } = this.state;
    if (!this.isValidAddress() || Number.parseFloat(value).toString() === 'NaN' || !gasLimit) {
      return false;
    }
    const { balance = 0 } = this.getToken() ?? {};
    if (value > balance) {
      return false;
    }

    return true;
  }

  render() {
    const { tokenIndex = -1 } = this.props.route?.params || {};
    const { toAddress, value } = this.state;
    const { balance, symbol } = this.getToken() ?? {};
    const { loading } = txService;
    const { selected: gasInfo } = gasService;
    return (
      <Page loading={loading} loadingText={lang('token.send.pending')}>
        <Column space={5} padding={3}>
          <FormControl isRequired isInvalid={!this.isValidAddress()}>
            <FormControl.Label>{lang('token.receive.address')}</FormControl.Label>
            <Input value={toAddress} onChangeText={this.handleAddressChange} />
            <FormControl.HelperText>{lang(`token.receive.tip`)(symbol)}</FormControl.HelperText>
            <FormControl.ErrorMessage>{lang(`token.receive.address.error`)}</FormControl.ErrorMessage>
          </FormControl>
          <FormControl isRequired>
            <FormControl.Label>{`${lang('token.send.amount')} (${symbol})`}</FormControl.Label>
            <Input value={value} keyboardType="numeric" onChangeText={v => this.handleNumberValueChange('value', v)} />
            <FormControl.HelperText>{`${lang('balance')} ${balance}`}</FormControl.HelperText>
          </FormControl>
          <GasCard gasInfo={gasInfo} tokenIndex={tokenIndex} />

          <Button isDisabled={!this.isValid()} isLoading={loading} onPress={this.handleSend}>
            {lang('token.send')}
          </Button>
        </Column>
      </Page>
    );
  }
}
