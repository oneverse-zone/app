import React, { Component } from 'react';
import PINCode, { hasUserSetPinCode, IProps } from '@haskkor/react-native-pincode';
import { autoBind } from 'jsdk/autoBind';
import { sessionService } from '../services/Session';
import { resetTo } from '../core/navigation';
import { route } from './router';

/**
 * Pin Code
 */
@autoBind
export class PinCode extends Component<any, any> {
  static options = {
    headerShown: false,
  };

  state: { status: IProps['status'] } = {
    status: 'choose',
  };

  constructor(props: any) {
    super(props);
    this.init();
  }

  async init() {
    const hasSetPinCode = await hasUserSetPinCode();
    let status;
    if (hasSetPinCode) {
      status = 'enter';
    } else {
      status = 'choose';
    }
    this.setState({
      status,
    });
  }

  async handleFinish(pinCode?: string) {
    await sessionService.unlock(pinCode || '');
    const { authenticated } = sessionService;
    if (authenticated) {
      console.log('用户已经注册,进入首页');
      resetTo(route.Home);
    } else {
      console.log('用户未注册,进入开始页面');
      resetTo(route.Start);
    }
  }

  render() {
    const { status } = this.state;

    return (
      <PINCode
        status={status}
        finishProcess={this.handleFinish}
        titleChoose="输入您的PIN密码"
        subtitleChoose="PIN密码用于保护您的信息安全"
        stylePinCodeColorTitle="#000"
        stylePinCodeColorSubtitle="#000"
        colorPassword="#000"
      />
    );
  }
}
