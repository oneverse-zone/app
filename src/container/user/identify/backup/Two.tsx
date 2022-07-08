import React, { Component } from 'react';
import { autoBind } from 'jsdk/autoBind';
import { Page } from '../../../../components/Page';
import { lang } from '../../../../locales';
import { PageTitle } from '../../../../components/PageTitle';
import { Button } from 'native-base';
import { MnemonicAlert } from './MnemonicAlert';

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
  };

  openSwitch() {
    this.setState({ open: !this.state.open });
  }

  render() {
    const { open } = this.state;
    return (
      <Page>
        <PageTitle
          title={lang('protect-your-account')}
          description={
            <>
              {lang('protect-your-account')}
              <Button
                key="1"
                variant="link"
                padding={0}
                marginBottom={-0.49}
                alignItems="center"
                onPress={this.openSwitch}>
                {lang('mnemonic')}
              </Button>
            </>
          }
        />
        <MnemonicAlert open={open} onClose={this.openSwitch} />
      </Page>
    );
  }
}
