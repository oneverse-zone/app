import React, { Component } from 'react';
import { View } from 'native-base';
import { WalletList } from './WalletList';
import { WalletNewActionSheet } from './WalletNewActionSheet';

/**
 * 钱包选择页面
 */
export class WalletSelect extends Component<any, any> {
  static options = {
    presentation: 'modal',
  };

  render() {
    return (
      <View>
        <WalletList />
        <WalletNewActionSheet isOpen={true} />
      </View>
    );
  }
}
