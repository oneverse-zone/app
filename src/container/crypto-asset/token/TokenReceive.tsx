import React, { Component } from 'react';
import { autoBind } from 'jsdk/autoBind';
import { observer } from 'mobx-react';
import { Alert, Button, Column, Icon, Row, Spacer, Text, Toast } from 'native-base';
import QRCode from 'react-native-qrcode-svg';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { Page } from '../../../components/Page';
import { lang } from '../../../locales';
import { goBack } from '../../../core/navigation';
import Clipboard from '@react-native-clipboard/clipboard';
import { walletManagerService } from '../../../services/blockchain/wallet-manager';
import { TokenAvatar } from '../components/token-avatar';

/**
 * token 接收
 */
@observer
@autoBind
export class TokenReceive extends Component<any, any> {
  static options = ({ route }: any) => ({
    headerBackTitleVisible: false,
    headerTransparent: true,
    headerTitleStyle: {
      color: 'white',
    },
    title: `${route.params?.token?.symbol} ${lang('token.receive')}`,
  });

  constructor(props: any, context: any) {
    super(props, context);
    const { token } = props.route?.params || {};
    if (!token) {
      goBack();
      return;
    }
  }

  handleCopy() {
    const { selectedAccount } = walletManagerService;
    Clipboard.setString(selectedAccount?.address ?? '');
    Toast.show({
      placement: 'top',
      description: lang('copy.success'),
    });
  }

  render() {
    const { selectedAccount } = walletManagerService;
    const token = this.props.route?.params || {};

    const tipLang = lang('token.receive.tip');

    return (
      <Page safeAreaBottom scroll={{ backgroundColor: 'primary.500' }} padding={5} paddingTop={120}>
        <Alert borderColor="warning" colorScheme="warning">
          <Row flexShrink={1} space={2} alignItems="center">
            <Alert.Icon mt="1" />
            <Text fontSize="xs">{typeof tipLang === 'function' && tipLang(token?.token?.symbol)}</Text>
          </Row>
        </Alert>
        <Column borderRadius="lg" space={8} marginTop={50} padding={3} backgroundColor="white" alignItems="center">
          <TokenAvatar token={token?.token} size="lg" marginTop="-43" />
          <QRCode value={selectedAccount?.address ?? ''} size={200} />
          <Text width={180 + 100} textAlign="center">
            {selectedAccount?.address}
          </Text>
          <Button variant="link" leftIcon={<Icon as={MaterialIcons} name="content-copy" />} onPress={this.handleCopy}>
            {lang('copy')}
          </Button>
        </Column>
        <Spacer />
        <Text textAlign="center">{'OneVerse'}</Text>
      </Page>
    );
  }
}
