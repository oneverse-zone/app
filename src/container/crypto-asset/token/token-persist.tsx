import React, { Component } from 'react';
import { autoBind } from 'jsdk/autoBind';
import { observer } from 'mobx-react';
import { Page } from '../../../components/Page';
import { Button } from '../../../components/Button';
import { lang } from '../../../locales';
import { Alert, Column, FormControl, Input, KeyboardAvoidingView, Row, Text, Toast } from 'native-base';
import { accountAdapter } from '../../../services/blockchain/account-adapter';
import { tokenService } from '../../../services/blockchain/token';
import { TokenType } from '../../../entity/blockchain/token';

/**
 * 新增、编辑
 */
@observer
@autoBind
export class TokenPersist extends Component<any, any> {
  state = {
    address: '',
  };

  handleAddressChange(address: string) {
    this.setState({ address });
  }

  async handleAdd() {
    const { address } = this.state;
    if (!address) {
      return;
    }
    const baseToken = await tokenService.getTokenInfo(address);
    if (baseToken) {
      await tokenService.add(TokenType.ERC20, address, baseToken);
    }
  }

  render() {
    const { address }: any = this.state;
    const { loading } = tokenService;
    return (
      <Page Root={KeyboardAvoidingView} loading={loading}>
        <Alert borderColor="warning" colorScheme="warning" margin={3}>
          <Row flexShrink={1} space={2} alignItems="center">
            <Alert.Icon mt="1" />
            <Text fontSize="sm">{lang('token.add.tip')}</Text>
          </Row>
        </Alert>
        <Column space={5} padding={3}>
          <FormControl isRequired>
            <FormControl.Label>{lang('contract.address')}</FormControl.Label>
            <Input value={address} returnKeyType="search" onChangeText={this.handleAddressChange} />
          </FormControl>

          <Button onPress={this.handleAdd} isDisabled={loading} isLoading={loading}>
            {lang('ok')}
          </Button>
        </Column>
      </Page>
    );
  }
}
