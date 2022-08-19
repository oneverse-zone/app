import React, { Component } from 'react';
import {
  AddIcon,
  Avatar,
  Box,
  Button,
  ChevronDownIcon,
  FlatList,
  Spacer,
  IconButton,
  IPressableProps,
  Menu,
  Pressable,
  Row,
  Text,
} from 'native-base';
import { autoBind } from 'jsdk/autoBind';
import { observer } from 'mobx-react';
import { lang } from '../../../locales';
import { walletManagerService } from '../../../services/blockchain/wallet-manager';
import { Wallet, WalletType } from '../../../entity/blockchain/wallet';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { WalletAccount } from '../../../entity/blockchain/wallet-account';
import { WalletAccountEmpty } from '../components/WalletAccountEmpty';
import { blockchainService } from '../../../services/blockchain';
import { navigate } from '../../../core/navigation';
import { route } from '../../router';
import { WalletNewActionSheet } from '../components/WalletNewActionSheet';
import { Page } from '../../../components/Page';
import { Title } from '../../../components/Title';
import { BlockchainAvatar } from '../../../components/BlockchainAvatar';
import { WalletAccountCreateModal } from '../blockchain/wallet-account-create-modal';
import { coinService } from '../../../services/blockchain/coin';

function ItemSeparatorComponent() {
  return <Box height={3} />;
}

/**
 * 钱包选择页面
 */
@observer
@autoBind
export class WalletManager extends Component<any, any> {
  static options = {
    title: lang('wallet.manager'),
    headerBackTitleVisible: false,
  };

  state = {
    createModalOpen: false,
    open: false,
  };

  openSwitch() {
    this.setState({ open: !this.state.open });
  }

  createOpenSwitch() {
    this.setState({ createModalOpen: !this.state.createModalOpen });
  }

  goBlockchainSelect() {
    navigate(route.BlockchainSelect);
  }

  /**
   * 处理创建账户
   */
  handleCreateAccount(name: string, addressIndex: number) {
    const { selected, selectedAccount } = walletManagerService;
    if (selected && selectedAccount) {
      const coin = coinService.findById(selectedAccount.coinId);
      coin && walletManagerService.createAccount(selected, coin, name, addressIndex);
    }
  }

  renderWalletItem({ item, index }: { item: Wallet; index: number }) {
    const { name } = item;
    const { selected } = walletManagerService;
    return (
      <Pressable onPress={() => walletManagerService.selectWallet(index)}>
        <Avatar bg={selected?.id === item.id ? 'primary.500' : 'gray.300'} size="md">
          {name.charAt(0)}
        </Avatar>
      </Pressable>
    );
  }

  renderAccountItem({ item }: { item: WalletAccount }) {
    const { selectedAccount } = walletManagerService;
    const props: IPressableProps = {};
    if (selectedAccount?.id === item.id) {
      props.borderColor = 'primary.500';
    }
    return (
      <Pressable
        borderColor="coolGray.300"
        {...props}
        flexDirection="row"
        justifyContent="space-between"
        padding={3}
        borderRadius="lg"
        borderWidth={1}
        onPress={() => walletManagerService.selectAccount(item.id)}>
        <Title
          title={item.name}
          titleProps={{
            fontSize: 14,
            fontWeight: '500',
            color: 'black',
          }}
          subtitle={item.address}
          subtitleProps={{
            ellipsizeMode: 'middle',
            numberOfLines: 1,
            width: 80,
            fontSize: 14,
            fontWeight: '400',
            color: 'gray.700',
            style: {
              width: 100,
            },
          }}
        />
        <Menu
          w="190"
          placement="left bottom"
          shouldOverlapWithTrigger
          trigger={triggerProps => {
            return (
              <Pressable accessibilityLabel="Wallet options" {...triggerProps} borderRadius="lg">
                <IconButton size="lg" _icon={{ as: MaterialIcons, name: 'more-horiz' }} />
              </Pressable>
            );
          }}>
          <Menu.Item>Arial</Menu.Item>
          <Menu.Item>{lang('wallet.account.address.copy')}</Menu.Item>
        </Menu>
      </Pressable>
    );
  }

  render() {
    const { wallet, wallets, selected, selectedAccount, loading } = walletManagerService;
    const { selectedAccountsOnSelectChain } = walletManagerService;
    const { selected: selectedBlockchain } = blockchainService;
    const { createModalOpen, open } = this.state;

    return (
      <Page Root={Row} scroll={false} flex={1} loading={loading} bg="white">
        <Box
          width={80.001}
          height="full"
          paddingY={3}
          borderRightWidth={1}
          borderColor="coolGray.100"
          alignItems="center"
          safeAreaBottom>
          <FlatList data={wallets} renderItem={this.renderWalletItem} ItemSeparatorComponent={ItemSeparatorComponent} />
          <IconButton onPress={this.openSwitch} size="lg" variant="solid" icon={<AddIcon />} />
        </Box>
        <Box flex={1} safeAreaBottom paddingX={3}>
          <Row height={60.001} justifyContent="space-between" alignItems="center">
            <Text fontSize="lg">{selected?.name}</Text>
            <Menu
              w="190"
              placement="left bottom"
              shouldOverlapWithTrigger
              trigger={triggerProps => {
                return (
                  <Pressable accessibilityLabel="Wallet options" {...triggerProps}>
                    <IconButton size="lg" _icon={{ as: MaterialIcons, name: 'more-horiz' }} />
                  </Pressable>
                );
              }}>
              <Menu.Item>Arial</Menu.Item>
              <Menu.Item>Nunito Sans</Menu.Item>
              <Menu.Item>Roboto</Menu.Item>
              <Menu.Item>Poppins</Menu.Item>
              <Menu.Item>SF Pro</Menu.Item>
              <Menu.Item>Helvetica</Menu.Item>
              <Menu.Item isDisabled>Sofia</Menu.Item>
              <Menu.Item>Cookie</Menu.Item>
            </Menu>
          </Row>
          <Pressable
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            width="full"
            height={50}
            backgroundColor="white"
            borderWidth={1}
            borderColor="coolGray.300"
            padding={3}
            borderRadius="xl"
            onPress={this.goBlockchainSelect}
            marginBottom={3}>
            {selectedBlockchain && <BlockchainAvatar blockchain={selectedBlockchain} size="sm" />}
            <Text color="primary.500">{selectedBlockchain ? selectedBlockchain.name : lang('all')}</Text>
            <Spacer />
            <ChevronDownIcon />
          </Pressable>
          <FlatList
            data={selectedAccountsOnSelectChain}
            renderItem={this.renderAccountItem}
            ListEmptyComponent={WalletAccountEmpty}
            ItemSeparatorComponent={ItemSeparatorComponent}
            extraData={selectedAccount}
          />
          {selected?.type === WalletType.HD && (
            <Button
              size="lg"
              variant="outline"
              leftIcon={<AddIcon />}
              borderRadius="lg"
              onPress={this.createOpenSwitch}>
              {lang('wallet.account.add')}
            </Button>
          )}
        </Box>
        {/*创建账户Modal*/}
        <WalletAccountCreateModal
          accounts={selectedAccountsOnSelectChain}
          isOpen={createModalOpen}
          onClose={this.createOpenSwitch}
          onCreate={this.handleCreateAccount}
        />

        {/*创建钱包*/}
        <WalletNewActionSheet didWallet={wallet} isOpen={open} onClose={this.openSwitch} />
      </Page>
    );
  }
}
