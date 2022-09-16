import React, { Component } from 'react';
import { autoBind } from 'jsdk/autoBind';
import { observer } from 'mobx-react';
import { Page } from '../components/Page';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { lang } from '../locales';
import { FormControl } from 'native-base';
import { singleInputService } from '../services/SingleInput';

/**
 * 单输入框
 */
@observer
@autoBind
export class SingleInputScreen extends Component<any, any> {
  static options = ({ route }: any) => {
    const { title } = route.params || {};
    return {
      headerBackTitleVisible: false,
      presentation: 'modal',
      title,
    };
  };

  render() {
    const { loading, helperText, defaultValue, value, inputProps = {}, handleChange } = singleInputService;
    return (
      <Page loading={loading} padding={3}>
        <FormControl>
          <Input {...inputProps} value={value} onChangeText={handleChange} mb={3} />
          <FormControl.HelperText>{helperText}</FormControl.HelperText>
        </FormControl>
        <Button
          isLoading={loading}
          isDisabled={!value || value === defaultValue}
          onPress={singleInputService.handleConfirm}>
          {lang('ok')}
        </Button>
      </Page>
    );
  }
}
