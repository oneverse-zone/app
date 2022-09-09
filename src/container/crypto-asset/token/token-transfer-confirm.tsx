import React, { Component } from 'react';
import { autoBind } from 'jsdk/autoBind';
import { observer } from 'mobx-react';
import { Page } from '../../../components/Page';
import { lang } from '../../../locales';
import { txService } from '../../../services/blockchain/tx';
import { GasCard } from '../components/gas-card';
import { Button } from '../../../components/Button';
import { gasService } from '../../../services/blockchain/gas';
import { tokenService } from '../../../services/blockchain/token';
import { walletManagerService } from '../../../services/blockchain/wallet-manager';
import { goBack } from '../../../core/navigation';
import { Column, FormControl, Text } from 'native-base';
import { AddressText } from '../../../components/AddressText';
import { TokenType } from '../../../entity/blockchain/token';
import { parseUnits } from '@ethersproject/units';

const MAX_QUERY_GAS_COUNT = 50;

/**
 * 转账确认和手续费确认
 */
@observer
@autoBind
export class TokenTransferConfirm extends Component<any, any> {
  static options = ({ route }: any) => {
    const { tokenIndex = -1 } = route.params || {};
    const token = tokenService.selectTokens[tokenIndex];
    return {
      title: `${lang('token.send')}(${token?.token?.symbol})${lang('confirm')}`,
      headerBackTitleVisible: false,
    };
  };

  state = {
    toAddress: '',
    value: '',
    token: undefined as any,
  };
  queryGasCount = 1;
  timer?: NodeJS.Timer;

  constructor(props: any) {
    super(props);
    const { toAddress, value, tokenIndex = -1 } = this.props.route?.params || {};
    const token = tokenService.selectTokens[tokenIndex];

    if (!toAddress || !value || !token) {
      goBack();
      return;
    }
    this.state.toAddress = toAddress;
    this.state.value = value;
    this.state.token = token as any;
    this.updateGas();
    this.timer = setInterval(this.updateGas, 1000 * 30);
  }

  componentWillUnmount() {
    this.timer && clearInterval(this.timer);
    this.timer = undefined;
  }

  updateGas() {
    if (this.queryGasCount > MAX_QUERY_GAS_COUNT) {
      this.timer && clearInterval(this.timer);
      this.timer = undefined;
      return;
    }
    const { selectedAccount } = walletManagerService;
    const { token, toAddress, value }: any = this.state;
    if (!token || !selectedAccount) {
      return;
    }
    if (token.type === TokenType.COIN) {
      gasService.update(token);
    } else {
      // 合约执行预估gas费
      gasService.update(token, {
        method: 'transfer',
        params: [toAddress, parseUnits(`${value}`, token.token.decimals)],
      });
    }
  }

  basicTxArgs() {
    const { selected, selectedAccount } = walletManagerService;
    const { toAddress, value, token } = this.state;
    if (!token || !selectedAccount || !selected) {
      return {};
    }

    return {
      wallet: selected,
      account: selectedAccount,
      token,
      to: toAddress,
      value,
    };
  }

  handleSend() {
    const gasInfo = gasService.selected;
    if (!gasInfo) {
      console.log(`无法获取gas费信息`);
      return;
    }
    txService.send({
      ...(this.basicTxArgs() as any),
      gasInfo,
    });
  }

  render() {
    const { toAddress, value, token } = this.state;
    const { selectedAccount } = walletManagerService;
    const { loading } = txService;
    const { selectedMainToken } = tokenService;
    const { selected: gasInfo, loading: gasLoading } = gasService;

    return (
      <Page Root={Column} space={5} padding={3} loading={loading} loadingText={lang('token.send.pending')}>
        <FormControl isReadOnly>
          <FormControl.Label>{lang('token.send.address')}</FormControl.Label>
          <AddressText
            address={selectedAccount?.address ?? ''}
            ellipsizeMode={undefined}
            width="100%"
            numberOfLines={2}
          />
        </FormControl>
        <FormControl isReadOnly>
          <FormControl.Label>{lang('token.receive.address')}</FormControl.Label>
          <AddressText address={toAddress} ellipsizeMode={undefined} width="100%" numberOfLines={2} />
        </FormControl>
        <FormControl isReadOnly>
          <FormControl.Label>{`${lang('token.send.amount')} (${token?.token?.symbol})`}</FormControl.Label>
          <Text>{value}</Text>
        </FormControl>
        <FormControl>
          <FormControl.Label>{`${lang('gas')} (${token?.token?.symbol})`}</FormControl.Label>
          <GasCard loading={gasLoading} gasInfo={gasInfo} symbol={selectedMainToken?.token?.symbol ?? ''} />
        </FormControl>
        <Button isDisabled={gasLoading} isLoading={loading} onPress={this.handleSend}>
          {lang('token.send')}
        </Button>
      </Page>
    );
  }
}
