import React, { Component } from 'react';
import { SectionList } from 'react-native';
import { autoBind } from 'jsdk/autoBind';
import { observer } from 'mobx-react';
import { AddIcon, Avatar, Box, Button, Text } from 'native-base';
import { walletService } from '../../../services/Wallet';
import { lang } from '../../../locales';
import { ListItem } from '../../../components/ListItem';
import { Wallet, WalletType } from '../../../entity/Wallet';
import { FixedBottomView } from '../../../components/FixedBottomView';
import { findToken } from '../../../constants/Token';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { replace } from '../../../core/navigation';
import { route } from '../../router';

@observer
@autoBind
export class WalletList extends Component<any, any> {
  handleCreate() {
    replace(route.BlockchainSelect);
  }

  renderSectionHeader({ section: { title } }: any) {
    return <Text padding={3}>{title}</Text>;
  }

  renderItem({ item }: { item: Wallet }) {
    let iconElement;
    if (item.type === WalletType.HD) {
      iconElement = <MaterialIcons name="account-balance-wallet" size={24} />;
    } else if (item.type === WalletType.SINGLE_CHAIN) {
      const Logo = findToken(item.tokens[0].coinId, item.tokens[0].contractAddress)?.logo;
      iconElement = Logo ? <Logo /> : item.name;
    }
    const icon = (
      <Avatar size="sm" bg="white">
        {iconElement}
      </Avatar>
    );
    return <ListItem icon={icon} title={item.name} marginX={3} borderRadius="lg" showArrow={false} />;
  }

  render() {
    const { wallet, list } = walletService;
    const data = [
      {
        title: lang('wallet.hd'),
        data: wallet ? [wallet] : [],
      },
      {
        title: lang('wallet.single-chain'),
        data: list,
      },
    ];
    return (
      <Box height="full">
        <SectionList sections={data} renderSectionHeader={this.renderSectionHeader} renderItem={this.renderItem} />
        <FixedBottomView padding={0}>
          <Button.Group>
            <Button variant="ghost" flex={1} borderRadius={0} leftIcon={<AddIcon />} onPress={this.handleCreate}>
              {lang('wallet.create')}
            </Button>
          </Button.Group>
        </FixedBottomView>
      </Box>
    );
  }
}
