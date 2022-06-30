import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { walletService } from '../../services/Wallet';
import { Button } from 'native-base';

/**
 * 钱包管理页面
 */
export class Wallet extends Component<any, any> {
  constructor(props: any) {
    super(props);
    walletService.query();
  }

  render() {
    return (
      <View>
        <Button onPress={walletService.preCreate}>{'创建钱包'}</Button>
      </View>
    );
  }
}
