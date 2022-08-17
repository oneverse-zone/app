import React, { Component } from 'react';
import { autoBind } from 'jsdk/autoBind';
import { Box, Center, Column, Heading, Icon, Row, Text, Toast } from 'native-base';
import Clipboard from '@react-native-clipboard/clipboard';

import { Page } from '../../components/Page';
import { lang } from '../../locales';
import { PageTitle } from '../../components/PageTitle';
import { Button } from '../../components/Button';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { FixedBottomView } from '../../components/FixedBottomView';
import { goBack, navigate } from '../../core/navigation';
import { route } from '../router';
import { Word } from './Word';

/**
 * 备份第二步骤
 */
@autoBind
export class BackupTwo extends Component<any, any> {
  static options = {
    title: lang('app.name'),
    headerBackTitleVisible: false,
    headerShadowVisible: false,
  };

  state = {
    open: false,
    mnemonicWords: [],
  };

  constructor(props: any) {
    super(props);
    const { mnemonic } = props.route.params || {};
    if (!mnemonic) {
      goBack();
      return;
    }

    this.state.mnemonicWords = mnemonic.split(' ');
  }

  openSwitch() {
    this.setState({ open: !this.state.open });
  }

  async handleCopy() {
    Clipboard.setString(this.state.mnemonicWords.join(' '));
    Toast.show({ description: lang('mnemonic.copy.tip'), placement: 'top' });
  }

  handleNext() {
    Clipboard.setString('');
    navigate(route.BackupThree);
  }

  render() {
    const { open, mnemonicWords } = this.state;
    return (
      <Page paddingX={8} space={3}>
        <PageTitle title={lang('backup.two.title')} description={lang('backup.two.describe')} />
        <Box borderRadius="lg" minH={260}>
          {open ? (
            <Row flexWrap="wrap" paddingY={3}>
              {mnemonicWords.map((item, index) => (
                <Word word={item} key={index} />
              ))}
            </Row>
          ) : (
            <Center flex={1} bgColor="coolGray.800" justifyContent="space-around" paddingY={4}>
              <Icon as={<MaterialIcons name="visibility-off" />} size={6} color="white" />
              <Column space={2} alignItems="center">
                <Heading size="sm" color="white">
                  {lang('backup.two.look-over-mnemonic')}
                </Heading>
                <Text fontSize="xs" color="white">
                  {lang('backup.two.look-over-mnemonic.tip')}
                </Text>
              </Column>
              <Button variant="outline" width={150} _text={{ color: 'white' }} onPress={this.openSwitch}>
                {lang('look-over')}
              </Button>
            </Center>
          )}
        </Box>
        <FixedBottomView paddingX={7}>
          <Button marginTop={5} variant="ghost" _text={{ fontSize: 'sm' }} onPress={this.handleCopy}>
            {lang('mnemonic.copy')}
          </Button>
          <Button marginTop={3} onPress={this.handleNext}>
            {lang('next-step')}
          </Button>
        </FixedBottomView>
      </Page>
    );
  }
}
