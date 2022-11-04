import React, { Component } from 'react';
import { autoBind } from 'jsdk/autoBind';
import { observer } from 'mobx-react';
import { Box, Button, Column, Row, Text } from 'native-base';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { MaterialTopTabNavigationOptions } from '@react-navigation/material-top-tabs/lib/typescript/src/types';

import { goBack, navigate } from '../../../core/navigation';
import { FixedBottomView } from '../../../components/FixedBottomView';
import { lang } from '../../../locales';
import { route } from '../../../core/route.config';
import { TokenTransactionScreen } from './TokenTransaction';
import { walletManagerService } from '../../../services/blockchain/wallet-manager';
import { TokenAvatar } from '../components/token-avatar';
import { formatBalance } from '../../../utils/coin-utils';
import { AddressText } from '../../../components/AddressText';
import { AccountToken } from '../../../entity/blockchain/wallet-account';
import { Title } from '../../../components/Title';

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
  static options = ({ route }: any) => {
    const { token } = route.params || {};
    return {
      headerBackTitleVisible: false,
      headerTitle: () => (
        <Title
          title={token?.token?.symbol}
          titleProps={{ textAlign: 'center', fontSize: 'sm' }}
          subtitle={token?.token?.name}
          subtitleProps={{ fontSize: 'xs', textAlign: 'center' }}
        />
      ),
    };
  };

  constructor(props: any) {
    super(props);
    const { token } = props.route?.params || {};

    if (!token) {
      console.log('没有传递token信息，返回上一页');
      goBack();
      return;
    }
    // props.navigation.setOptions({
    //   title: () => <Title title={token.token.symbol} subtitle={token.token.name} />,
    // });
  }

  handleSend() {
    const { index } = this.props.route?.params || {};
    navigate(route.TokenTransfer, { tokenIndex: index });
  }

  handleReceive() {
    const { token } = this.props.route?.params || {};
    navigate(route.TokenReceive, token);
  }

  render() {
    const { token } = this.props.route?.params || {};
    const { balance } = token as AccountToken;
    const { name, symbol } = token.token;
    const { selectedAccount } = walletManagerService;

    return (
      <Box flex={1}>
        <Box bgColor="white" padding={3}>
          <Row space="3" alignItems="center">
            <TokenAvatar token={token.token} />
            <Column>
              <Text fontSize="lg" fontWeight="400">
                {selectedAccount?.name}
                <Text style={{ marginLeft: 3 }} fontSize="xs" color="coolGray.700">
                  {`(${name})`}
                </Text>
              </Text>
              <AddressText address={selectedAccount?.address ?? ''} width={150} lineHeight={24} />
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
