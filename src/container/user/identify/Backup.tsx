import React, { Component } from 'react';
import { Column } from 'native-base';
import { Page } from '../../../components/Page';
import { PageTitle } from '../../../components/PageTitle';

/**
 * 帐户备份
 */
export class AccountBackup extends Component<any, any> {
  render() {
    return (
      <Page paddingX={9} Root={Column} space={5}>
        <PageTitle title={'backup'} description={'backup'} />
      </Page>
    );
  }
}
