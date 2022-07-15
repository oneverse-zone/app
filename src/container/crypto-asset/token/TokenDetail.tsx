import React, { Component } from 'react';
import { autoBind } from 'jsdk/autoBind';
import { observer } from 'mobx-react';
import { Avatar, Button, Center, Divider, Heading, Row, Text, View } from 'native-base';
import { goBack, navigate } from '../../../core/navigation';
import { WalletToken } from '../../../entity/Wallet';
import { findToken } from '../../../constants/Token';
import { FixedBottomView } from '../../../components/FixedBottomView';
import { lang } from '../../../locales';
import { route } from '../../router';

/**
 * token 详情页
 * 需要上一个页面传递 WalletToken 信息
 */
@observer
@autoBind
export class TokenDetail extends Component<any, any> {
  constructor(props: any) {
    super(props);
    const token: WalletToken = props.route?.params;

    if (!token) {
      console.log('没有传递token信息，返回上一页');
      goBack();
      return;
    }
    props.navigation.setOptions({
      title: token.symbol,
    });
  }

  handleSend() {
    const token: WalletToken = this.props.route?.params;
    navigate(route.TokenSend, token);
  }

  render() {
    const { coinId, contractAddress, balance }: WalletToken = this.props.route?.params;
    const Logo = findToken(coinId, contractAddress)?.logo;
    const icon = Logo && (
      <Avatar size="sm" bg="white">
        <Logo />
      </Avatar>
    );
    return (
      <View flex={1}>
        <Center margin={3} padding={3} backgroundColor="white" borderRadius="lg">
          {icon}
          <Text fontWeight="500" fontSize="3xl">
            {balance}
          </Text>
        </Center>
        <FixedBottomView flexDirection="row">
          <Button flex={1} onPress={this.handleSend}>
            {lang('token.send')}
          </Button>
          <Divider mx={1.5} orientation="vertical" />
          <Button flex={1}>{lang('token.receive')}</Button>
        </FixedBottomView>
      </View>
    );
  }
}
