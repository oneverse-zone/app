import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { autoBind } from 'jsdk/autoBind';
import { StyleSheet } from 'react-native';
import { NavigationState, SceneMap, SceneRendererProps, TabView } from 'react-native-tab-view';
import { Box, FormControl, ITextProps, Pressable, Row, Text, Column, Center } from 'native-base';
import { lang } from '../../../locales';
import { InputPassword } from '../../../components/InputPassword';
import { Page } from '../../../components/Page';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';

/**
 * 导入私钥
 * @constructor
 */
function ImportPrivateKey() {
  return <Box />;
}

/**
 * 导入助记词
 * @constructor
 */
function ImportMnemonic() {
  return (
    <Column margin={3} space={5} padding={5} backgroundColor="white">
      <FormControl isRequired>
        <FormControl.Label>{lang('mnemonic')}</FormControl.Label>
        <Input multiline numberOfLines={3} />
      </FormControl>
      <FormControl>
        <FormControl.Label>{lang('mnemonic.password')}</FormControl.Label>
        <InputPassword />
        <FormControl.HelperText>{lang('mnemonic.password.tip')}</FormControl.HelperText>
      </FormControl>
      <Button>{lang('ok')}</Button>
    </Column>
  );
}

const routes = [
  {
    key: 'mnemonic',
    title: lang('mnemonic'),
  },
  {
    key: 'privateKey',
    title: lang('privateKey'),
  },
];

@observer
@autoBind
export class WalletRecover extends Component<any, any> {
  static options = {
    headerBackTitleVisible: false,
  };

  state = {
    tabIndex: 0,
  };

  renderScene = SceneMap({
    mnemonic: ImportMnemonic,
    privateKey: ImportPrivateKey,
  });

  renderTabBar({ navigationState }: SceneRendererProps & { navigationState: NavigationState<any> }) {
    return (
      <Center>
        <Row
          alignItems="center"
          height={48.1}
          backgroundColor="white"
          borderRadius="full"
          borderBottomColor="coolGray.300"
          borderBottomWidth={StyleSheet.hairlineWidth}
          paddingX={5}>
          {navigationState.routes.map((route, index) => {
            const isFocused = navigationState.index === index;

            const onPress = () => {
              this.setState({ tabIndex: index });
            };

            let textProps: ITextProps = {
              color: 'coolGray.500',
            };
            if (isFocused) {
              textProps = {
                color: 'black',
                fontWeight: '500',
              };
            }

            return (
              <Pressable key={route.key} onPress={onPress} paddingX={3}>
                <Text {...textProps}>{route.title}</Text>
              </Pressable>
            );
          })}
        </Row>
      </Center>
    );
  }

  render() {
    return (
      <Page scroll={{ backgroundColor: '#F2F2F2' }} paddingTop={5}>
        <TabView
          navigationState={{ index: this.state.tabIndex, routes }}
          renderScene={this.renderScene}
          onIndexChange={index => this.setState({ tabIndex: index })}
          renderTabBar={this.renderTabBar}
          style={{ flex: 1 }}
        />
      </Page>
    );
  }
}
