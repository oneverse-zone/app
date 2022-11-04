import React, { Component } from 'react';
import { Box } from 'native-base';
import { HeaderAddIconButton } from '../../../components/HeaderAddIconButton';
import { lang } from '../../../locales';
import { navigate } from '../../../core/navigation';
import { route } from '../../../core/route.config';

function handleAddPress() {
  navigate(route.TokenPersist);
}

/**
 * token 管理页面
 */
export class TokenManager extends Component<any, any> {
  static options = (props: any) => ({
    title: lang('token.manager'),
    headerRight: () => <HeaderAddIconButton {...props} onPress={handleAddPress} />,
  });

  render() {
    return <Box></Box>;
  }
}
