import React, { Component } from 'react';
import { autoBind } from 'jsdk/autoBind';
import { observer } from 'mobx-react';
import { Page } from '../../../components/Page';
import { Button } from '../../../components/Button';
import { lang } from '../../../locales';
import { Column, FormControl, Input, KeyboardAvoidingView, Toast } from 'native-base';
import { accountAdapter } from '../../../services/blockchain/account-adapter';
import { tokenService } from '../../../services/blockchain/token';

/**
 * 新增、编辑
 */
@observer
@autoBind
export class TokenPersist extends Component<any, any> {
  state = {
    address: '',
    baseToken: null,
  };

  handleAddressChange(address: string) {
    this.setState({ address });
  }

  async getTokenInfo() {
    const { address } = this.state;
    if (!address) {
      return;
    }
    this.setState({ baseToken: null });
    const baseToken = await accountAdapter().getTokenInfo(address);
    if (baseToken) {
      console.log(baseToken);
      this.setState({ baseToken });
    } else {
      Toast.show({
        title: lang('contract.address.invalid'),
      });
    }
  }

  async handleAdd() {
    await this.getTokenInfo();
    const { baseToken } = this.state;
    if (!baseToken) {
      return;
    }
  }

  render() {
    const { address, baseToken }: any = this.state;
    const { loading } = tokenService;
    return (
      <Page Root={KeyboardAvoidingView} loading={loading}>
        <Column space={5} padding={3}>
          <FormControl isRequired>
            <FormControl.Label>{lang('contract.address')}</FormControl.Label>
            <Input
              value={address}
              returnKeyType="search"
              onEndEditing={this.getTokenInfo}
              onChangeText={this.handleAddressChange}
            />
          </FormControl>
          <FormControl isReadOnly>
            <FormControl.Label>{lang('token.name')}</FormControl.Label>
            <Input value={baseToken?.name} />
          </FormControl>
          <FormControl isReadOnly>
            <FormControl.Label>{lang('token.symbol')}</FormControl.Label>
            <Input value={baseToken?.symbol} />
          </FormControl>
          <FormControl isReadOnly>
            <FormControl.Label>{lang('token.decimals')}</FormControl.Label>
            <Input value={`${baseToken?.decimals ?? ''}`} />
          </FormControl>

          <Button onPress={this.handleAdd}>{lang('ok')}</Button>
        </Column>
      </Page>
    );
  }
}
