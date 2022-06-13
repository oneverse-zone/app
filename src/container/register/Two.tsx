import React, {Component} from 'react';
import {Page} from '../../components/Page';
import {goBack, resetTo} from '../../core/navigation';
import {sessionService} from '../../services/Session';
import {Box, Button, Column, Heading, Text} from 'native-base';
import {observer} from 'mobx-react';
import {Route} from '../router';

@observer
export class RegisterTwo extends Component<any, any> {
  state = {
    mnemonic: null,
  };

  constructor(props: any) {
    super(props);
    this.handleRegister();
  }

  async handleRegister() {
    const {password} = this.props.route?.params || {};
    if (password) {
      const mnemonic = await sessionService.registerAndLogin(password);
      console.log(mnemonic);
      this.setState({mnemonic});
    } else {
      console.log('未提供密码');
      goBack();
    }
  }

  async handleFinish() {
    resetTo(Route.Home);
  }

  render() {
    const {loading, id} = sessionService;
    const {mnemonic} = this.state;
    return (
      <Page loading={loading} padding={3} bgColor="#FFF" flex={1}>
        {mnemonic && (
          <Column space={3}>
            <Heading>{'您的去中心化身份创建成功'}</Heading>
            <Text>{'请牢记并备份您的账户ID和助记词到安全的地方'}</Text>
            <Text>{'您的账户ID'}</Text>
            <Box padding={3} bgColor="#f5f6f7">
              <Text selectable>{id}</Text>
            </Box>
            <Text>{'您的账户助记词'}</Text>
            <Box padding={3} bgColor="#f5f6f7">
              <Text selectable>{mnemonic}</Text>
            </Box>
            <Button onPress={this.handleFinish}>{'开始体验'}</Button>
          </Column>
        )}
      </Page>
    );
  }
}
