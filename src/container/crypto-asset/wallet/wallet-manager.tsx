import React, { Component } from 'react';
import {
  AddIcon,
  Avatar,
  Box,
  Button,
  FlatList,
  Icon,
  IconButton,
  IPressableProps,
  Menu,
  Modal,
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
import { walletAccountService } from '../../../services/blockchain/wallet-account';
import { WalletAccount } from '../../../entity/blockchain/wallet-account';
import { WalletAccountEmpty } from '../components/WalletAccountEmpty';
import { blockchainService } from '../../../services/blockchain';
import { navigate } from '../../../core/navigation';
import { route } from '../../router';
import { WalletNewActionSheet } from '../components/WalletNewActionSheet';
import { Page } from '../../../components/Page';
import { Title } from '../../../components/Title';

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

  // handleSelect(wallet: Wallet, index: number) {
  //   walletService.selectWallet(index);
  //   const { nextRoute, autoBack = true } = this.props.route.params || {};
  //   if (nextRoute) {
  //     replace(nextRoute);
  //   } else if (autoBack) {
  //     goBack();
  //   }
  // }

  renderWalletItem({ item, index }: { item: Wallet; index: number }) {
    const { name } = item;
    return (
      <Pressable onPress={() => walletManagerService.selectWallet(index)}>
        <Avatar bg="primary.500" size="lg">
          {name.charAt(0)}
        </Avatar>
      </Pressable>
    );
  }

  renderAccountItem({ item }: { item: WalletAccount }) {
    const { selected } = walletAccountService;
    const props: IPressableProps = {};
    if (selected?.tokens[0]?.blockchainId === item.tokens[0].blockchainId && selected?.address === item.address) {
      props.bg = 'primary.500';
    }
    return (
      <Pressable flexDirection="row" justifyContent="space-between" paddingBottom={3} borderRadius="lg" borderWidth={0}>
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
    const { wallet, wallets, selected, loading } = walletManagerService;
    const { selectWalletAccounts } = walletAccountService;
    const { selected: selectedBlockchain } = blockchainService;
    const { createModalOpen, open } = this.state;
    return (
      <Page Root={Row} scroll={false} flex={1} loading={loading}>
        <Box
          width={80.001}
          height="full"
          paddingY={3}
          borderRightWidth={1}
          borderColor="coolGray.300"
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
            <Text color="primary.500">{selectedBlockchain ? selectedBlockchain.name : lang('all')}</Text>
            <Icon as={MaterialIcons} name="expand-more" size="md" />
          </Pressable>
          <FlatList
            data={selectWalletAccounts}
            renderItem={this.renderAccountItem}
            ListEmptyComponent={WalletAccountEmpty}
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
        <Modal isOpen={createModalOpen} onClose={this.createOpenSwitch}>
          <Modal.Content>
            <Modal.CloseButton />
            <Modal.Header>{lang('wallet.account.add')}</Modal.Header>
            <Modal.Body></Modal.Body>
          </Modal.Content>
        </Modal>
        {/*创建钱包*/}
        <WalletNewActionSheet didWallet={wallet} isOpen={open} onClose={this.openSwitch} />
      </Page>
    );
  }
}
