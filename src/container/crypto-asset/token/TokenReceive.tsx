import React, { Component } from 'react';
import { autoBind } from 'jsdk/autoBind';
import { observer } from 'mobx-react';
import { Avatar, Button, Center, Column, Icon, Spacer, Text, Toast } from 'native-base';
import QRCode from 'react-native-qrcode-svg';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { Page } from '../../../components/Page';
import { WalletToken } from '../../../entity/Wallet';
import { lang } from '../../../locales';
import { goBack } from '../../../core/navigation';
import { findToken } from '../../../constants/Token';
import Clipboard from '@react-native-clipboard/clipboard';

/**
 * token 接收
 */
@observer
@autoBind
export class TokenReceive extends Component<any, any> {
  static options = {
    headerBackTitleVisible: false,
  };

  constructor(props: any) {
    super(props);
    const token: WalletToken = props.route?.params;
    if (!token) {
      goBack();
      return;
    }
    props.navigation.setOptions({
      title: `${token.symbol} ${lang('token.receive')}`,
    });
  }

  handleCopy() {
    const token: WalletToken = this.props.route?.params;
    Clipboard.setString(token?.address);
    Toast.show({
      placement: 'top',
      description: lang('copy.success'),
    });
  }

  render() {
    const token: WalletToken = this.props.route?.params;
    const Logo = findToken(token.coinId, token.contractAddress)?.logo;
    const logo = Logo && (
      <Avatar size="md" bg="white" top={-35}>
        <Logo />
      </Avatar>
    );

    const tipLang = lang('token.receive.tip');

    return (
      <Page safeAreaBottom>
        <Column
          borderRadius="lg"
          space={5}
          margin={3}
          marginTop={50}
          padding={3}
          backgroundColor="coolGray.100"
          alignItems="center">
          {logo}
          <QRCode value={token?.address} size={150} />
          <Text width={150 + 80} textAlign="center">
            {token?.address}
          </Text>
          <Button variant="link" leftIcon={<Icon as={MaterialIcons} name="content-copy" />} onPress={this.handleCopy}>
            {lang('token.address.copy')}
          </Button>
        </Column>
        <Spacer />
        <Center>
          <Text width={150 + 80} textAlign="center">
            {typeof tipLang === 'function' && tipLang(token?.symbol)}
          </Text>
        </Center>
      </Page>
    );
  }
}
