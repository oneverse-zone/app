import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { autoBind } from 'jsdk/autoBind';
import { AddIcon, Box, Button, ChevronDownIcon, Icon, IconButton, Row, Text } from 'native-base';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { MaterialTopTabNavigationOptions } from '@react-navigation/material-top-tabs/lib/typescript/src/types';
import { lang } from '../../locales';
import SendIcon from '../../assets/svg/arrow-up-from-bracket-solid.svg';
import { TokenTabScreen } from './token/token-tab';
import { NftTabScreen } from './nft/nft-tab';
import { navigate } from '../../core/navigation';
import { route } from '../router';
import { WalletNewActionSheet } from './components/WalletNewActionSheet';
import { Page } from '../../components/Page';
import { WalletSelectButton } from './components/WalletSelectButton';
import { Empty } from './Empty';
import { walletManagerService } from '../../services/blockchain/wallet-manager';
import { tokenService } from '../../services/blockchain/token';
import { blockchainService } from '../../services/blockchain';
import { logos } from '../../components/BlockchainAvatar';

const commonOptions: MaterialTopTabNavigationOptions = {
  tabBarStyle: {
    alignContent: 'center',
  },
  tabBarItemStyle: {
    // width: 'auto',
    height: 50,
  },
  tabBarLabelStyle: {
    fontWeight: '500',
  },
};

const Tab = createMaterialTopTabNavigator();

const tabs: Record<
  string,
  MaterialTopTabNavigationOptions & {
    component: React.ComponentType<any>;
  }
> = {
  Token: {
    title: lang('token'),
    component: TokenTabScreen,
  },
  NFT: {
    title: lang('nft'),
    component: NftTabScreen,
  },
};

function CryptoAssetRight({ navigation }: any) {
  function handlePress() {}

  return <IconButton borderRadius="full" icon={<AddIcon />} onPress={handlePress} />;
}

const CryptoAssetTitle = observer(function CryptoAssetTitle() {
  function handlePress() {
    navigate(route.BlockchainSelect);
  }

  const { selected } = blockchainService;
  const Logo = logos[selected?.id ?? ''];
  const icon = Logo && <Icon as={Logo} size="md" />;
  return (
    <Button borderRadius="full" variant="ghost" leftIcon={icon} rightIcon={<ChevronDownIcon />} onPress={handlePress}>
      {selected?.name ?? ''}
    </Button>
  );
});

/**
 * 加密资产
 */
@observer
@autoBind
export class CryptoAsset extends Component<any, any> {
  static options = (props: any) => ({
    headerTitle: () => <CryptoAssetTitle {...props} />,
    headerLeft: WalletSelectButton,
    // headerRight: () => <WalletAddButton {...props} />,
  });

  state = {
    open: false,
  };

  openSwitch() {
    this.setState({ open: !this.state.open });
  }

  handleSend() {
    navigate(route.TokenSelect, {
      nextRoute: route.TokenSend,
    });
  }

  handleReceive() {
    navigate(route.TokenSelect, {
      nextRoute: route.TokenReceive,
    });
  }

  renderDefault() {
    const { selectedAccount } = walletManagerService;
    const token = (tokenService.tokens[selectedAccount?.id ?? ''] || [])[0];
    return (
      <>
        <Box
          borderRadius="lg"
          margin={3}
          padding={3}
          backgroundColor="primary.500"
          minH={120}
          justifyContent="space-between">
          <Text fontWeight="500" fontSize="2xl" color="white">
            {0}
          </Text>
          <Row>
            <Button
              size="sm"
              variant="ghost"
              _text={{ color: 'white' }}
              leftIcon={<SendIcon color="white" width={16} height={16} fill="white" />}
              onPress={this.handleSend}>
              {lang('token.send')}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              _text={{ color: 'white' }}
              leftIcon={<SendIcon color="white" width={16} height={16} fill="white" />}
              onPress={this.handleReceive}>
              {lang('token.receive')}
            </Button>
          </Row>
        </Box>
        <Box flex={1}>
          <Tab.Navigator initialRouteName="Token" screenOptions={commonOptions}>
            {Object.keys(tabs).map(key => {
              const { component, ...options } = tabs[key];
              return <Tab.Screen name={key} key={key} component={component} options={options} />;
            })}
          </Tab.Navigator>
        </Box>
      </>
    );
  }

  render() {
    const { wallet, wallets, loading } = walletManagerService;
    const { open } = this.state;
    return (
      <Page loading={loading} scroll={false}>
        {wallets.length === 0 ? <Empty onOpen={this.openSwitch} {...(this.props as any)} /> : this.renderDefault()}
        <WalletNewActionSheet didWallet={wallet} isOpen={open} onClose={this.openSwitch} />
      </Page>
    );
  }
}
