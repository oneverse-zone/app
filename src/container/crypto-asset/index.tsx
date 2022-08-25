import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import { autoBind } from 'jsdk/autoBind';
import {
  AddIcon,
  Box,
  Button,
  ChevronDownIcon,
  Column,
  Icon,
  IconButton,
  Pressable,
  Row,
  Text,
  Spacer,
  ITextProps,
} from 'native-base';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {
  MaterialTopTabBarProps,
  MaterialTopTabNavigationConfig,
  MaterialTopTabNavigationOptions,
} from '@react-navigation/material-top-tabs/lib/typescript/src/types';
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
import { blockchainService } from '../../services/blockchain';
import { logos } from '../../components/BlockchainAvatar';
import { AddressText } from '../../components/AddressText';
import { tokenService } from '../../services/blockchain/token';

const commonOptions: MaterialTopTabNavigationOptions = {
  tabBarStyle: {
    alignContent: 'center',
  },
  tabBarItemStyle: {
    width: 'auto',
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
    tabBarLabel: lang('token'),
    component: TokenTabScreen,
  },
  NFT: {
    tabBarLabel: lang('nft'),
    component: NftTabScreen,
  },
};

function handleGoTokenManager() {
  navigate(route.TokenManager);
}

function TabBar({ state, descriptors, navigation, position }: MaterialTopTabBarProps) {
  return (
    <Row
      alignItems="center"
      height={48.1}
      backgroundColor="white"
      borderBottomColor="coolGray.300"
      borderBottomWidth={StyleSheet.hairlineWidth}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            (navigation.navigate as any)({ name: route.name, merge: true }, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        let textProps: ITextProps = {
          color: 'coolGray.500',
        };
        if (isFocused) {
          textProps = {
            color: 'black',
            fontWeight: '500',
          };
        }

        return (
          <Pressable key={route.key} onPress={onPress} onLongPress={onLongPress} paddingX={3}>
            <Text {...textProps}>{options.tabBarLabel}</Text>
          </Pressable>
        );
      })}
      <Spacer />
      {state.index === 0 && <IconButton icon={<AddIcon />} borderRadius="full" onPress={handleGoTokenManager} />}
    </Row>
  );
}

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
    const { selectedMainTokenIndex } = tokenService;
    navigate(route.TokenTransfer, { tokenIndex: selectedMainTokenIndex });
  }

  handleReceive() {
    const { selectedMainTokenIndex } = tokenService;
    navigate(route.TokenReceive, tokenService.selectTokens[selectedMainTokenIndex]);
  }

  renderDefault() {
    const { selectedAccount } = walletManagerService;
    return (
      <>
        <Box
          borderRadius="lg"
          margin={3}
          padding={3}
          backgroundColor="primary.500"
          minH={100}
          justifyContent="space-between">
          <Column>
            <Text color="white">{selectedAccount?.name}</Text>
            <AddressText fontSize="xs" color="white" width={120.001} address={selectedAccount?.address ?? ''} />
            <Text fontWeight="500" fontSize="2xl" color="white">
              {0}
            </Text>
          </Column>
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
          <Tab.Navigator initialRouteName="Token" screenOptions={commonOptions} tabBar={TabBar}>
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
