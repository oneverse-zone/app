import React, { Component } from 'react';
import { autoBind } from 'jsdk/autoBind';
import { Box, CloseIcon, IconButton } from 'native-base';
import { BlockchainList } from './components/BlockchainList';
import { lang } from '../../../locales';
import { Action, WalletNewActionSheet } from '../wallet/components/WalletNewActionSheet';
import { Blockchain } from '../../../entity/Blockchain';
import { route } from '../../router';
import { goBack, replace } from '../../../core/navigation';
import { blockchainService } from '../../../services/blockchain';

/**
 * 区块链选择页面
 */
@autoBind
export class BlockchainSelect extends Component<any, any> {
  static options = {
    title: lang('blockchain.select'),
    headerLeft: () => <IconButton colorScheme="dark" borderRadius="full" icon={<CloseIcon />} onPress={goBack} />,
  };

  state: { selected: Blockchain | null; walletActionOpen: boolean } = {
    walletActionOpen: false,
    selected: null,
  };

  handleBlockchainSelect(blockchain: Blockchain) {
    this.setState({ selected: blockchain, walletActionOpen: true });
  }

  /**
   * 处理钱包创建动作
   * @param type 创建或者恢复
   */
  handleActionSelect(type: Action) {
    let nextRoute;
    switch (type) {
      case 'create':
        nextRoute = route.WalletCreate;
        break;
      case 'recover':
        nextRoute = route.WalletRecover;
        break;
      case 'hd':
        nextRoute = route.WalletHDCreate;
        break;
    }
    replace(nextRoute, {
      blockchain: this.state.selected,
    });
  }

  actionSwitch() {
    this.setState({ walletActionOpen: !this.state.walletActionOpen });
  }

  render() {
    const { walletActionOpen, selected } = this.state;
    return (
      <Box flex={1}>
        <BlockchainList onItemPress={this.handleBlockchainSelect} />
        <WalletNewActionSheet
          isOpen={walletActionOpen}
          onSelect={this.handleActionSelect}
          onClose={this.actionSwitch}
          showHDAction={!!selected?.id && blockchainService.supportHD(selected.id)}
        />
      </Box>
    );
  }
}
