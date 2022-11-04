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
  ITextProps,
  Pressable,
  Row,
  Spacer,
  Text,
} from 'native-base';
import { lang } from '../../locales';
import SendIcon from '../../assets/svg/arrow-up-from-bracket-solid.svg';
import { TokenTabScreen } from './token/token-tab';
import { NftTabScreen } from './nft/nft-tab';
import { navigate } from '../../core/navigation';
import { route } from '../../core/route.config';
import { WalletNewActionSheet } from './components/WalletNewActionSheet';
import { Page } from '../../components/Page';
import { WalletSelectButton } from './components/WalletSelectButton';
import { Empty } from './Empty';
import { walletManagerService } from '../../services/blockchain/wallet-manager';
import { blockchainService } from '../../services/blockchain';
import { logos } from '../../components/BlockchainAvatar';
import { AddressText } from '../../components/AddressText';
import { tokenService } from '../../services/blockchain/token';
import { NavigationState, SceneMap, SceneRendererProps, TabView } from 'react-native-tab-view';

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

const routes = [
  {
    key: 'token',
    title: lang('token'),
  },
  {
    key: 'nft',
    title: lang('nft'),
  },
];

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
    refreshing: true,
    tabIndex: 0,
  };

  componentDidMount() {
    this.handleRefresh();
  }

  /**
   * 刷新页面数据
   */
  async handleRefresh() {
    this.setState({ refreshing: true });
    try {
      if (this.state.tabIndex === 0) {
        await tokenService.updateSelectAccountToken();
      }
    } finally {
      this.setState({ refreshing: false });
    }
  }

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

  handleGoTokenManager() {
    navigate(route.TokenManager);
  }

  renderScene = SceneMap({
    token: TokenTabScreen,
    nft: NftTabScreen,
  });

  renderTabBar({ navigationState }: SceneRendererProps & { navigationState: NavigationState<any> }) {
    return (
      <Row
        alignItems="center"
        height={48.1}
        backgroundColor="white"
        borderBottomColor="coolGray.300"
        borderBottomWidth={StyleSheet.hairlineWidth}>
        {navigationState.routes.map((route, index) => {
          const isFocused = navigationState.index === index;

          const onPress = () => {
            this.setState({ tabIndex: index });
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
            <Pressable key={route.key} onPress={onPress} paddingX={3}>
              <Text {...textProps}>{route.title}</Text>
            </Pressable>
          );
        })}
        <Spacer />
        {navigationState.index === 0 && (
          <IconButton icon={<AddIcon />} borderRadius="full" onPress={this.handleGoTokenManager} />
        )}
      </Row>
    );
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
        <TabView
          navigationState={{ index: this.state.tabIndex, routes }}
          renderScene={this.renderScene}
          sceneContainerStyle={{ backgroundColor: '#F2F2F2' }}
          onIndexChange={index => this.setState({ tabIndex: index })}
          renderTabBar={this.renderTabBar}
        />
      </>
    );
  }

  render() {
    const { wallet, wallets, loading } = walletManagerService;
    const { open, refreshing } = this.state;
    return (
      <Page loading={loading} refreshing={refreshing} onRefresh={this.handleRefresh}>
        {wallets.length === 0 ? <Empty onOpen={this.openSwitch} {...(this.props as any)} /> : this.renderDefault()}
        <WalletNewActionSheet didWallet={wallet} isOpen={open} onClose={this.openSwitch} />
      </Page>
    );
  }
}
