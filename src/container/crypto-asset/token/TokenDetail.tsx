import React, { Component } from 'react';
import { autoBind } from 'jsdk/autoBind';
import { observer } from 'mobx-react';
import { Avatar, Box, Button, Column, Icon, Row, Text, Toast } from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Clipboard from '@react-native-clipboard/clipboard';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { MaterialTopTabNavigationOptions } from '@react-navigation/material-top-tabs/lib/typescript/src/types';

import { goBack, navigate } from '../../../core/navigation';
import { WalletToken } from '../../../entity/Wallet';
import { FixedBottomView } from '../../../components/FixedBottomView';
import { lang } from '../../../locales';
import { route } from '../../router';
import { TokenTransactionScreen } from './TokenTransaction';
import { tokenService } from '../../../services/Token';

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

  handleReceive() {
    const token: WalletToken = this.props.route?.params;
    navigate(route.TokenReceive, token);
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
    const { name, coinId, balance, address, symbol } = token;

    const Logo = tokenService.findToken(coinId, address)?.logo;
    const icon = Logo && (
      <Avatar size="sm" bg="white">
        <Logo />
      </Avatar>
    );
    return (
      <Box flex={1}>
        <Box bgColor="white" padding={3}>
          <Row space="3" alignItems="center">
            {icon}
            <Column>
              <Text fontWeight="400">{name}</Text>
              <Text width={150} ellipsizeMode="middle" numberOfLines={1} onPress={this.handleCopy} lineHeight={24}>
                {address}
                <Icon size="xs" as={<MaterialIcons name="content-copy" />} />
              </Text>
            </Column>
          </Row>
          <Text fontWeight="500" fontSize="2xl" my={1}>
            {balance}
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
