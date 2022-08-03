import React, { Component } from 'react';
import { autoBind } from 'jsdk/autoBind';
import { observer } from 'mobx-react';
import { Alert, Avatar, Button, Column, Icon, Row, Spacer, Text, Toast } from 'native-base';
import QRCode from 'react-native-qrcode-svg';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { Page } from '../../../components/Page';
import { WalletToken } from '../../../entity/Wallet';
import { lang } from '../../../locales';
import { goBack } from '../../../core/navigation';
import Clipboard from '@react-native-clipboard/clipboard';
import { tokenService } from '../../../services/Token';

/**
 * token 接收
 */
@observer
@autoBind
export class TokenReceive extends Component<any, any> {
  static options = {
    headerBackTitleVisible: false,
  };

  constructor(props: any, context: any) {
    super(props, context);
    const token: WalletToken = props.route?.params;
    if (!token) {
      goBack();
      return;
    }
    console.log(context);
    props.navigation.setOptions({
      title: `${token.symbol} ${lang('token.receive')}`,
      headerTransparent: true,
    });
  }

  handleCopy() {
    const token: WalletToken = this.props.route?.params;
    Clipboard.setString(token?.contractAddress);
    Toast.show({
      placement: 'top',
      description: lang('copy.success'),
    });
  }

  render() {
    const token: WalletToken = this.props.route?.params;
    const Logo = tokenService.findToken(token.coinId, token.contractAddress)?.logo;
    const logo = Logo && (
      <Avatar size="md" bg="white" top={-35}>
        <Logo />
      </Avatar>
    );

    const tipLang = lang('token.receive.tip');

    return (
      <Page safeAreaBottom scroll={{ backgroundColor: 'primary.500' }} padding={5} paddingTop={120}>
        <Alert borderColor="warning" colorScheme="warning">
          <Row flexShrink={1} space={2} alignItems="center">
            <Alert.Icon mt="1" />
            <Text fontSize="xs">{typeof tipLang === 'function' && tipLang(token?.symbol)}</Text>
          </Row>
        </Alert>
        <Column borderRadius="lg" space={8} marginTop={50} padding={3} backgroundColor="white" alignItems="center">
          {logo}
          <QRCode value={token?.address} size={200} />
          <Text width={180 + 100} textAlign="center">
            {token?.address}
          </Text>
          <Button variant="link" leftIcon={<Icon as={MaterialIcons} name="content-copy" />} onPress={this.handleCopy}>
            {lang('token.address.copy')}
          </Button>
        </Column>
        <Spacer />
        <Text>{'OneVerse'}</Text>
      </Page>
    );
  }
}
