import React, { Component } from 'react';
import { autoBind } from 'jsdk/autoBind';
import { observer } from 'mobx-react';
import { Box, Button, Column, Icon, Row, Text, Toast } from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Clipboard from '@react-native-clipboard/clipboard';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { MaterialTopTabNavigationOptions } from '@react-navigation/material-top-tabs/lib/typescript/src/types';

import { goBack, navigate } from '../../../core/navigation';
import { FixedBottomView } from '../../../components/FixedBottomView';
import { lang } from '../../../locales';
import { route } from '../../router';
import { TokenTransactionScreen } from './TokenTransaction';
import { FullToken } from '../../../entity/blockchain/wallet-account';
import { walletManagerService } from '../../../services/blockchain/wallet-manager';
import { TokenAvatar } from '../components/token-avatar';
import { formatBalance } from '../../../utils/coin-utils';

const commonTab: MaterialTopTabNavigationOptions = {
  tabBarStyle: {
    alignContent: 'center',
  },
  tabBarItemStyle: {
    width: 'auto',
  },
};

const Tab = createMaterialTopTabNavigator();

const tabs: Record<
  string,
  MaterialTopTabNavigationOptions & {
    component: React.ComponentType<any>;
    params: any;
  }
> = {
  All: {
    ...commonTab,
    tabBarLabel: lang('all'),
    component: TokenTransactionScreen,
    params: {},
  },
  In: {
    ...commonTab,
    tabBarLabel: lang('token.in'),
    component: TokenTransactionScreen,
    params: { type: 'in' },
  },
  Out: {
    ...commonTab,
    tabBarLabel: lang('token.out'),
    component: TokenTransactionScreen,
    params: { type: 'out' },
  },
};

/**
 * token 详情页
 * 需要上一个页面传递 WalletToken 信息
 */
@observer
@autoBind
export class TokenDetail extends Component<any, any> {
  static options = {
    headerBackTitleVisible: false,
  };

  constructor(props: any) {
    super(props);
    const token: FullToken = props.route?.params;

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
    const token: FullToken = this.props.route?.params;
    navigate(route.TokenSend, token);
  }

  handleReceive() {
    const token: FullToken = this.props.route?.params;
    navigate(route.TokenReceive, token);
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
    const token: FullToken = this.props.route?.params;
    const { name, balance, symbol } = token;
    const { selectedAccount } = walletManagerService;

    return (
      <Box flex={1}>
        <Box bgColor="white" padding={3}>
          <Row space="3" alignItems="center">
            <TokenAvatar token={token} />
            <Column>
              <Text fontWeight="400">{name}</Text>
              <Text
                width={150}
                ellipsizeMode="middle"
                numberOfLines={1}
                onPress={this.handleCopy}
                lineHeight={24}
                borderRadius="full">
                {selectedAccount?.address}
                <Icon size="xs" as={<MaterialIcons name="content-copy" />} marginLeft={3} />
              </Text>
            </Column>
          </Row>
          <Text fontWeight="500" fontSize="2xl" my={1}>
            {formatBalance(balance)}
            <Text fontSize="md"> {symbol}</Text>
          </Text>
        </Box>
        <Box mt={3} flex={1}>
          <Tab.Navigator initialRouteName="All">
            {Object.keys(tabs).map(key => {
              const { component, params, ...options } = tabs[key];
              return (
                <Tab.Screen
                  name={key}
                  key={key}
                  component={component}
                  initialParams={{
                    ...params,
                    token,
                  }}
                  options={options}
                />
              );
            })}
          </Tab.Navigator>
        </Box>
        <FixedBottomView flexDirection="row">
          <Button flex={1} onPress={this.handleSend}>
            {lang('token.send')}
          </Button>
          <Box width={3} />
          <Button flex={1} onPress={this.handleReceive}>
            {lang('token.receive')}
          </Button>
        </FixedBottomView>
      </Box>
    );
  }
}
