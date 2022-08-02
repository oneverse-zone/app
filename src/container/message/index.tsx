import React, { Component } from 'react';
import { Box, IconButton } from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export class Message extends Component<any, any> {
  static options = {
    headerRight: () => {
      return (
        <>
          <IconButton icon={<MaterialIcons name="people-alt" size={25} />} />
        </>
      );
    },
  };
  render() {
    return <Box></Box>;
  }
}
