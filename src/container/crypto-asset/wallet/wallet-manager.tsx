import React, { Component } from 'react';
import { AddIcon, Avatar, Box, Button, FlatList, Icon, IconButton, Modal, Pressable, Row, Text } from 'native-base';
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
  };

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

  renderWalletItem({ item }: { item: Wallet }) {
    const { name } = item;
    return (
      <Avatar bg="primary.500" size="lg">
        {name.charAt(0)}
      </Avatar>
    );
  }

  renderAccountItem({ item }: { item: WalletAccount }) {
    return <Text>{item.name}</Text>;
  }

  render() {
    const { wallets, selected } = walletManagerService;
    const { selectWalletAccounts } = walletAccountService;
    const { selected: selectedBlockchain } = blockchainService;
    const { createModalOpen } = this.state;
    return (
      <Row flex={1}>
        <Box width={80.001} height="full" paddingY={3} borderRightWidth={1} alignItems="center" safeAreaBottom>
          <FlatList data={wallets} renderItem={this.renderWalletItem} />
          <IconButton size="lg" variant="solid" icon={<AddIcon />} />
        </Box>
        <Box flex={1} safeAreaBottom paddingX={3}>
          <Row height={60.001} justifyContent="space-between" alignItems="center">
            <Text fontSize="lg">{selected?.name}</Text>
            <IconButton size="lg" _icon={{ as: MaterialIcons, name: 'more-horiz' }} />
          </Row>
          <Pressable
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            width="full"
            height={50}
            backgroundColor="white"
            padding={3}
            borderRadius="xl"
            onPress={this.goBlockchainSelect}>
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
      </Row>
    );
  }
}
