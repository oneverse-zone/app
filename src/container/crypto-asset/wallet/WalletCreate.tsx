import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { autoBind } from 'jsdk/autoBind';
import { Page } from '../../../components/Page';
import { Column, FormControl, KeyboardAvoidingView, Radio, Row, WarningOutlineIcon } from 'native-base';
import { lang } from '../../../locales';
import { replace } from '../../../core/navigation';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { walletManagerService } from '../../../services/blockchain/wallet-manager';
import { InputPassword } from '../../../components/InputPassword';
import { PageTitle } from '../../../components/PageTitle';
import { route } from '../../router';

@observer
@autoBind
export class WalletCreate extends Component<any, any> {
  static options = {
    headerBackTitleVisible: false,
    headerTransparent: true,
    title: null,
  };
  state = {
    name: '',
    mnemonicLength: '12',
    password: '',
  };

  constructor(props: any) {
    super(props);
    const { walletIndex } = walletManagerService;
    this.state.name = `Wallet ${walletIndex}`;
  }

  createChangeFunc(k: string) {
    return (v: string) => this.setState({ [k]: v });
  }

  async handleCreate() {
    const { name, mnemonicLength, password } = this.state;
    if (!name) {
      return;
    }
    const mnemonic = await walletManagerService.createHDWallet(name, mnemonicLength === '12' ? 12 : 24, password);
    mnemonic && replace(route.BackupOne, { mnemonic, type: 'wallet' });
  }

  render() {
    const { loading } = walletManagerService;
    const { mnemonicLength, name } = this.state;

    return (
      <Page safeAreaTop paddingX={8} paddingY={3} Root={KeyboardAvoidingView}>
        <PageTitle title={lang('wallet.create.hd')} description={lang('wallet.create.hd.tip')} marginTop={70} />
        <Column space={5} marginTop={5}>
          <FormControl isRequired isInvalid={!name}>
            <FormControl.Label>{lang('wallet.name')}</FormControl.Label>
            <Input value={this.state.name} onChangeText={this.createChangeFunc('name')} />
            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
              {lang('wallet.create.name.tip')}
            </FormControl.ErrorMessage>
          </FormControl>
          {/*助记词个数*/}
          <FormControl isRequired>
            <FormControl.Label>{lang('mnemonic.length')}</FormControl.Label>
            <Radio.Group
              name="mnemonicLength"
              value={mnemonicLength}
              onChange={this.createChangeFunc('mnemonicLength')}>
              <Row space={3}>
                <Radio value="12">12</Radio>
                <Radio value="24">24</Radio>
              </Row>
            </Radio.Group>
          </FormControl>
          {/*助记词密码*/}
          <FormControl>
            <FormControl.Label>{lang('mnemonic.password')}</FormControl.Label>
            <InputPassword onChangeText={this.createChangeFunc('password')} />
            <FormControl.HelperText>{lang('mnemonic.password.tip')}</FormControl.HelperText>
          </FormControl>
          <Button isLoading={loading} onPress={this.handleCreate}>
            {lang('next-step')}
          </Button>
        </Column>
      </Page>
    );
  }
}
