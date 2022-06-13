import React, {Component} from 'react';
import {autoBind} from 'jsdk/autoBind';
import {observer} from 'mobx-react';
import {Button, Column, Input} from 'native-base';
import {userService} from '../../services/User';
import {Page} from '../../components/Page';
import {goBack} from '../../core/navigation';

@observer
@autoBind
export class ProfilePersist extends Component<any, any> {
  state = {
    name: '',
    email: '',
  };

  handleFieldChange(f: string, v: string) {
    this.setState({
      [f]: v,
    });
  }

  async handlePersist() {
    await userService.updateProfile(this.state);
    goBack();
  }

  render() {
    const {loading} = userService;
    return (
      <Page
        loading={loading}
        Root={Column}
        space={3}
        padding={3}
        bgColor="#FFF"
        flex={1}>
        <Input
          placeholder="昵称"
          onChangeText={v => this.handleFieldChange('name', v)}
        />
        <Input
          placeholder="邮箱"
          onChangeText={v => this.handleFieldChange('email', v)}
        />
        <Button onPress={this.handlePersist}>{'添加'}</Button>
      </Page>
    );
  }
}
