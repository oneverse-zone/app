import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { autoBind } from 'jsdk/autoBind';
import { Page } from '../../../components/Page';
import { Column, FormControl, KeyboardAvoidingView } from 'native-base';
import { lang } from '../../../locales';
import { walletService } from '../../../services/blockchain/wallet-manager';
import { goBack } from '../../../core/navigation';
import { tokenService } from '../../../services/blockchain/Token';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';

@observer
@autoBind
export class WalletHDCreate extends Component<any, any> {
  static options = {
    title: lang('wallet.create.hd'),
    headerBackTitleVisible: false,
  };
  state = {
    name: '',
  };

  constructor(props: any) {
    super(props);
    const { blockchain } = props.route.params || {};
    if (!blockchain) {
      goBack();
      return;
    }
    const token = tokenService.findCoin(blockchain);
    if (!token) {
      goBack();
      return;
    }

    const { hdWalletAddressIndex } = walletService;
    this.state.name = `HD-${token.symbol}-${(hdWalletAddressIndex[token.coinId] || 0) + 1}`;
  }

  createChangeFunc(k: string) {
    return (v: string) => this.setState({ [k]: v });
  }

  async handleCreate() {
    const { blockchain } = this.props.route.params || {};
    if (!blockchain) {
      goBack();
      return;
    }
    const token = tokenService.findCoin(blockchain);
    if (!token) {
      goBack();
      return;
    }
    await walletService.createHD(token, this.state.name);
    goBack();
  }

  render() {
    const { loading } = walletService;
    return (
      <Page padding={3} Root={KeyboardAvoidingView}>
        <Column space={3}>
          {/*助记词密码*/}
          <FormControl>
            <FormControl.Label>{lang('wallet.name')}</FormControl.Label>
            <Input value={this.state.name} onChangeText={this.createChangeFunc('name')} />
          </FormControl>
          <Button isLoading={loading} onPress={this.handleCreate}>
            {lang('next-step')}
          </Button>
        </Column>
      </Page>
    );
  }
}
