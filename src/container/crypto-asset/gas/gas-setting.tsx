import React, { Component, useState } from 'react';
import { autoBind } from 'jsdk/autoBind';
import { observer } from 'mobx-react';
import { Platform } from 'react-native';

import { Box, Card, Center, Column, FormControl, Icon, KeyboardAvoidingView, Row, Text } from 'native-base';
import { SceneMap, TabView } from 'react-native-tab-view';

import { Page } from '../../../components/Page';
import { gasService } from '../../../services/blockchain/gas';
import { tokenService } from '../../../services/blockchain/token';
import { goBack } from '../../../core/navigation';
import { lang } from '../../../locales';
import { GasGear } from '../../../entity/blockchain/gas';
import { ListItem } from '../../../components/ListItem';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { AccountToken } from '../../../entity/blockchain/wallet-account';

/**
 * gas档位选择页面
 * @constructor
 */
const GasGearTab = observer(function GasGearTab() {
  const { selectedGasInfoIndex, gasInfos, gasPriceUnit } = gasService;
  return (
    <Column margin={3} space={3}>
      {gasInfos
        .filter(item => item.gear !== GasGear.CUSTOM)
        .map((gasInfo, index) => {
          let timeText = gasInfo.time,
            timeUnit = lang('second');
          if (gasInfo.time > 60) {
            timeText = gasInfo.time / 60;
            timeUnit = lang('minute');
          }
          const footer = <Text>{`${timeText} ${timeUnit}`}</Text>;

          function handlePress() {
            gasService.select(index);
          }

          return (
            <ListItem
              onPress={handlePress}
              icon={
                <Icon
                  as={MaterialIcons}
                  name={selectedGasInfoIndex === index ? 'radio-button-checked' : 'radio-button-unchecked'}
                  color="primary.500"
                />
              }
              key={index}
              title={lang(`gas.gear.${gasInfo.gear.toLowerCase()}` as any)}
              titleProps={{ fontSize: 'sm' }}
              subtitle={`MaxFeePerGas ${gasInfo.maxFeePerGasUI} ${gasPriceUnit}`}
              subtitleProps={{ fontSize: 'xs', color: 'coolGray.500' }}
              footer={footer}
              showArrow={false}
              borderRadius="xl"
            />
          );
        })}
    </Column>
  );
});

/**
 * gas 自定义设置页面
 * @constructor
 */
const GasCustomTab = observer(function GasCustom() {
  const { selected, gasPriceUnit, loading } = gasService;

  const [maxFeePerGas, setMaxFeePerGas] = useState(`${selected.maxFeePerGasUI ?? ''}`);
  const [maxPriorityFeePerGas, setMaxPriorityFeePerGas] = useState(`${selected.maxPriorityFeePerGasUI ?? ''}`);
  const [gasLimit, setGasLimit] = useState(`${selected.gasLimit}`);

  function handleFinish() {
    if (!maxFeePerGas || !maxPriorityFeePerGas || !gasLimit) {
      return;
    }
    gasService.addCustom({ maxPriorityFeePerGas, maxFeePerGas, gasLimit });
  }

  return (
    <Column margin={3} padding={3} space={3} borderRadius="lg" bgColor="white">
      <FormControl>
        <FormControl.Label>{`${lang('gas.maxFeePerGas')} (${gasPriceUnit})`}</FormControl.Label>
        <Input keyboardType="numeric" value={maxFeePerGas} onChangeText={setMaxFeePerGas} />
        <FormControl.HelperText>{lang('gas.maxFeePerGas.describe')}</FormControl.HelperText>
      </FormControl>
      <FormControl>
        <FormControl.Label>{`${lang('gas.maxPriorityFeePerGas')} (${gasPriceUnit})`}</FormControl.Label>
        <Input keyboardType="numeric" value={maxPriorityFeePerGas} onChangeText={setMaxPriorityFeePerGas} />
        <FormControl.HelperText>{lang('gas.price.describe')}</FormControl.HelperText>
      </FormControl>
      <FormControl>
        <FormControl.Label>{lang('gas.limit')}</FormControl.Label>
        <Input keyboardType="numeric" value={gasLimit} onChangeText={setGasLimit} />
        <FormControl.HelperText>{lang('gas.limit.describe')}</FormControl.HelperText>
      </FormControl>

      <Button onPress={handleFinish} isLoading={loading} isDisabled={loading}>
        {lang('ok')}
      </Button>
    </Column>
  );
});

/**
 * Gas 设置页面
 */
@observer
@autoBind
export class GasSetting extends Component<any, any> {
  static options = {
    headerBackTitleVisible: false,
    title: lang('gas.setting'),
  };

  state = {
    index: 0,
    routes: [
      {
        key: 'gasGear',
        title: lang('gas.gear.select'),
      },
      {
        key: 'gasCustom',
        title: lang('custom'),
      },
    ],
  };

  timer?: NodeJS.Timer;

  constructor(props: any) {
    super(props);
    const { selectedGasInfoIndex } = gasService;
    this.state.index = selectedGasInfoIndex === -1 ? 1 : 0;
    this.getToken();
    this.updateGas();

    // this.timer = setInterval(this.updateGas, 1000 * 30);
  }

  componentWillUnmount() {
    this.timer && clearInterval(this.timer);
    this.timer = undefined;
  }

  getToken(): AccountToken | undefined {
    const token = tokenService.selectedMainToken;
    if (token) {
      return token;
    }
    goBack();
  }

  updateGas() {
    // if (this.queryGasCount > MAX_QUERY_GAS_COUNT) {
    //   this.timer && clearInterval(this.timer);
    //   this.timer = undefined;
    //   return;
    // }

    gasService.update();
  }

  renderScene = SceneMap({
    gasGear: GasGearTab,
    gasCustom: GasCustomTab,
  });

  render() {
    const { selected } = gasService;
    const token = this.getToken();
    return (
      <Page
        Root={KeyboardAvoidingView}
        behavior={Platform.select({
          ios: 'padding',
          android: 'height',
        })}>
        <Card>
          <Text>{lang('gas.fee')}</Text>
          <Text fontSize="xs">
            {selected.minGasFeeUI === selected.maxGasFeeUI
              ? `${selected.minGasFeeUI} ${token?.token?.symbol}`
              : `${selected.minGasFeeUI} ${token?.token?.symbol} ~ ${selected.maxGasFeeUI} ${token?.token?.symbol}`}
          </Text>
        </Card>
        <Box height={3} bgColor="#F2F2F2"></Box>
        <Center bgColor="#F2F2F2">
          <Row space="1" padding={1} bgColor="white" borderRadius="full">
            {this.state.routes.map((route, idx) => (
              <Button
                size="sm"
                variant={this.state.index === idx ? undefined : 'unstyled'}
                onPress={() => this.setState({ index: idx })}
                key={idx}>
                {route.title}
              </Button>
            ))}
          </Row>
        </Center>
        <TabView
          navigationState={this.state}
          renderScene={this.renderScene}
          sceneContainerStyle={{ backgroundColor: '#F2F2F2' }}
          onIndexChange={index => this.setState({ index })}
          renderTabBar={() => null}
        />
      </Page>
    );
  }
}
