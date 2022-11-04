import React, { Component } from 'react';
import { Box, Button, Text } from 'native-base';
import { sessionService } from '../services/Session';
import { Linking } from 'react-native';
import { autoBind } from 'jsdk/autoBind';

@autoBind
export class Auth extends Component<any, any> {
  async handleAuth() {
    const { didService } = sessionService;

    const { redirectUrl } = this.props.route.params;
    const result: any = await didService.authorize(this.props.route.params);
    console.log(result);
    const u = new URL(redirectUrl);
    u.searchParams.append('data', JSON.stringify(result));
    console.log(u.toString());
    const r = await Linking.openURL(u.toString());
    console.log(r);
  }

  render() {
    console.log(this.props);
    const params: Record<string, any> | undefined = this.props.route.params;
    return (
      <Box>
        {'授权其他应用访问'}
        <Text>{params?.name}</Text>
        <Text>{params?.url}</Text>

        <Button onPress={this.handleAuth}>{'同意'}</Button>
      </Box>
    );
  }
}
