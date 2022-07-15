import React, { Component } from 'react';
import { Platform } from 'react-native';
import { observer } from 'mobx-react';

import { autoBind } from 'jsdk/autoBind';
import { Page } from '../components/Page';
import {
  Center,
  Text,
  Column,
  FormControl,
  Heading,
  KeyboardAvoidingView,
  Modal,
  Icon,
  Input,
  WarningOutlineIcon,
} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { lang } from '../locales';
import { InputPassword } from '../components/InputPassword';
import { Button } from '../components/Button';
import { sessionService } from '../services/Session';
import { resetTo } from '../core/navigation';
import { route } from './router';

/**
 * 锁频页面
 */
@observer
@autoBind
export class LockScreen extends Component<any, any> {
  static options = {
    headerShown: false,
  };

  state = {
    tipOpen: false,
    delOpen: false,
    deleteText: '',
    password: '',

    loginErr: '',
  };

  tipOpenSwitch() {
    this.setState({ tipOpen: !this.state.tipOpen });
  }

  delOpenSwitch() {
    this.setState({ delOpen: !this.state.delOpen, tipOpen: false, deleteText: '' });
  }

  handleDeleteTextChange(deleteText: string) {
    this.setState({ deleteText });
  }

  handlePasswordChange(password: string) {
    this.setState({ password });
  }

  /**
   * 删除账户
   */
  async handleDelete() {
    this.delOpenSwitch();
    await sessionService.clearDevice();
  }

  async handleUnlock() {
    try {
      await sessionService.unlock(this.state.password);
      resetTo(route.Home);
    } catch (e) {
      console.log('解锁失败', e);
      this.setState({ loginErr: lang('password.error') });
    }
  }

  render() {
    const { tipOpen, delOpen, deleteText, password, loginErr } = this.state;
    const { loading } = sessionService;

    // 重置钱包两个弹框
    const footer = (
      <>
        <Modal isOpen={tipOpen} padding={5}>
          <Modal.Content width="full">
            <Modal.Body>
              <Column space="lg" paddingX={2}>
                <Heading size="md" color="danger.500" textAlign="center">
                  <Icon size="4xl" color="danger.500" as={<MaterialIcons name="report-problem" />} />
                  {'\n'}
                  {lang('identify.delete.title')}
                </Heading>
                <Text textAlign="center">
                  {lang('identify.delete.tip1')}
                  <Text bold>{lang('identify.delete.tip2')}</Text>
                  {lang('identify.delete.tip3')}
                </Text>
                <Text textAlign="center">
                  {lang('identify.delete.tip4')}
                  <Text bold>{lang('identify.delete.tip5')}</Text>
                  {lang('identify.delete.tip6')}
                </Text>

                <Column space="sm">
                  <Button colorScheme="danger" onPress={this.delOpenSwitch}>
                    {lang('i-understand-go-on')}
                  </Button>
                  <Button variant="outline" colorScheme="black" onPress={this.tipOpenSwitch}>
                    {lang('cancel')}
                  </Button>
                </Column>
              </Column>
            </Modal.Body>
          </Modal.Content>
        </Modal>
        <Modal isOpen={delOpen} padding={5}>
          <Modal.Content width="full">
            <Modal.Body>
              <Column space="lg">
                <Heading size="md" textAlign="center">
                  {lang('identify.delete.confirm.title')}
                </Heading>
                <Input autoFocus autoCapitalize="none" size="2xl" onChangeText={this.handleDeleteTextChange} />
                <Column space="sm" marginTop={7}>
                  <Button colorScheme="danger" onPress={this.handleDelete} isDisabled={deleteText !== 'delete'}>
                    {lang('identify.delete')}
                  </Button>
                  <Button variant="outline" colorScheme="black" onPress={this.delOpenSwitch}>
                    {lang('cancel')}
                  </Button>
                </Column>
              </Column>
            </Modal.Body>
          </Modal.Content>
        </Modal>
      </>
    );

    return (
      <Page
        paddingX={7}
        justifyContent="center"
        Root={KeyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        footer={footer}>
        <Column space="2xl">
          <Center>
            <Heading fontWeight="500">{lang('welcome-back')}</Heading>
          </Center>
          <FormControl isRequired isInvalid={!!loginErr}>
            <FormControl.Label>{lang('password')}</FormControl.Label>
            <InputPassword onChangeText={this.handlePasswordChange} />
            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{loginErr}</FormControl.ErrorMessage>
          </FormControl>
          <Button isDisabled={!password} onPress={this.handleUnlock} isLoading={loading}>
            {lang('login')}
          </Button>
          <Button variant="ghost" onPress={this.tipOpenSwitch}>
            {lang('identify.reset')}
          </Button>
        </Column>
      </Page>
    );
  }
}
