import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { autoBind } from 'jsdk/autoBind';
import { View } from 'react-native';

@observer
@autoBind
export class WalletRecover extends Component<any, any> {
  render() {
    return <View></View>;
  }
}
