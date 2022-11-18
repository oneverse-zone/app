import React, {Component} from 'react';
import {autoBind} from 'jsdk/autoBind';
import {observer} from 'mobx-react';
import {Box, CloseIcon, IconButton} from 'native-base';
import {BlockchainList} from '../components/BlockchainList';
import {lang} from '../../../locales';
import {Blockchain} from '../../../entity/blockchain/blockchain';
import {goBack} from '../../../core/navigation';
import {blockchainService} from '../../../services/blockchain';
import {FixedBottomView} from '../../../components/FixedBottomView';
import {Button} from '../../../components/Button';

/**
 * 区块链选择页面
 */
@observer
@autoBind
export class BlockchainSelect extends Component<any, any> {
  static options = {
    title: lang('blockchain.select'),
    headerLeft: () => (
      <IconButton
        colorScheme="dark"
        borderRadius="full"
        color="block"
        icon={<CloseIcon color="#000" />}
        onPress={goBack}
      />
    ),
    presentation: 'modal',
  };

  handleBlockchainSelect(blockchain: Blockchain) {
    const { blockchains } = blockchainService;
    const index = blockchains.findIndex(item => item.id === blockchain.id);
    blockchainService.selectBlockchain(index);
    goBack();
  }

  render() {
    const { mains, tests, customs, selected } = blockchainService;
    return (
      <Box flex={1}>
        <BlockchainList
          selected={selected}
          mainNets={mains}
          testNets={tests}
          customNets={customs}
          onItemPress={this.handleBlockchainSelect}
        />
        <FixedBottomView>
          <Button>{lang('blockchain.custom.add')}</Button>
        </FixedBottomView>
      </Box>
    );
  }
}
