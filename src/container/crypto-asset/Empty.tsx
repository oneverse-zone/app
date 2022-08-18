import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { autoBind } from 'jsdk/autoBind';
import { Column } from 'native-base';
import { Button } from '../../components/Button';
import { lang } from '../../locales';
import { Page } from '../../components/Page';
import { PageTitle } from '../../components/PageTitle';

export type EmptyProps = {
  onOpen: () => void;
  navigation: any;
};

@observer
@autoBind
export class Empty extends Component<EmptyProps, any> {
  componentDidMount() {
    this.props.navigation.setOptions({ headerShown: false });
  }

  componentWillUnmount() {
    this.props.navigation.setOptions({ headerShown: true });
  }

  render() {
    return (
      <Page safeAreaTop>
        <PageTitle title={lang('wallet.welcome.title')} description={lang('wallet.welcome.slogan')} marginTop={70} />
        <Column space={3} justifyContent="flex-end" alignItems="center" flex={1} safeAreaBottom mb={20}>
          <Button onPress={this.props.onOpen} borderColor="primary.500" width={250} _text={{ fontSize: 'sm' }}>
            {lang('wallet.create')}
          </Button>
        </Column>
      </Page>
    );
  }
}
