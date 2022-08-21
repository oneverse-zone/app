import React, { Component } from 'react';
import { autoBind } from 'jsdk/autoBind';
import { observer } from 'mobx-react';
import { Column, FormControl, Input, TextArea, Text } from 'native-base';
import { lang } from '../../../locales';
import { Page } from '../../../components/Page';
import { Button } from '../../../components/Button';
import { goBack } from '../../../core/navigation';
import { txService } from '../../../services/blockchain/tx';
import { AccountToken, FullToken } from '../../../entity/blockchain/wallet-account';
import { tokenService } from '../../../services/blockchain/token';
import { walletAdapter } from '../../../services/blockchain/adapter';
import { walletManagerService } from '../../../services/blockchain/wallet-manager';
import { mul } from '../../../utils/calculator';
import { BigNumber } from '@ethersproject/bignumber';
import Decimal from 'decimal.js';
import { formatEther, formatUnits } from '@ethersproject/units';
import { DEFAULT_GAS_INFO, gasService } from '../../../services/blockchain/gas';
import { GasCard } from '../components/gas-card';

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
    gasService.update(this.state.gasLimit);
  }

  async handleSend() {
    const { selectedAccount } = walletManagerService;
    const token = this.getToken();
    if (!token || !selectedAccount) {
      return;
    }
    const gasInfo = gasService.selected;
    if (!gasInfo) {
      console.log(`无法获取gas费信息 ${selectedAccount.blockchainId}`);
      return;
    }

    const { toAddress, value, gasLimit } = this.state;
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
    const { toAddress, value, gasLimit } = this.state;
    if (!toAddress || !value || !gasLimit) {
      return false;
    }
    return true;
  }

  render() {
    const { tokenIndex = -1 } = this.props.route?.params || {};
    const { toAddress, value } = this.state;
    const { balance } = this.getToken() ?? {};
    const { loading } = txService;
    const { selected: gasInfo } = gasService;
    return (
      <Page>
        <Column space={5} padding={3}>
          <FormControl isRequired isInvalid={!toAddress}>
            <FormControl.Label>{lang('token.receive.address')}</FormControl.Label>
            <Input value={toAddress} onChangeText={this.handleAddressChange} />
          </FormControl>
          <FormControl isRequired>
            <FormControl.Label>{lang('token.send.amount')}</FormControl.Label>
            <Input value={value} keyboardType="numeric" onChangeText={v => this.handleNumberValueChange('value', v)} />
            <FormControl.HelperText>{`${lang('balance')} ${balance}`}</FormControl.HelperText>
          </FormControl>
          <GasCard gasInfo={gasInfo} tokenIndex={tokenIndex} />

          {/*<FormControl>*/}
          {/*  <FormControl.Label>{`${lang('gas.price')} (${lang('gas.eth.unit.gwei')})`}</FormControl.Label>*/}
          {/*  <Input keyboardType="numeric" onChangeText={v => this.handleNumberValueChange('gasPrice', v)} />*/}
          {/*  <FormControl.HelperText>{lang('gas.price.describe')}</FormControl.HelperText>*/}
          {/*</FormControl>*/}
          {/*<FormControl>*/}
          {/*  <FormControl.Label>{lang('gas.limit')}</FormControl.Label>*/}
          {/*  <Input*/}
          {/*    value={gasLimit}*/}
          {/*    keyboardType="numeric"*/}
          {/*    onChangeText={v => this.handleNumberValueChange('gasLimit', v)}*/}
          {/*  />*/}
          {/*  <FormControl.HelperText>{lang('gas.limit.describe')}</FormControl.HelperText>*/}
          {/*</FormControl>*/}
          <Button isDisabled={!this.isValid() || loading} isLoading={loading} onPress={this.handleSend}>
            {lang('token.send')}
          </Button>
        </Column>
      </Page>
    );
  }
}
