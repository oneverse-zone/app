import React, { Component } from 'react';
import { autoBind } from 'jsdk/autoBind';
import { observer } from 'mobx-react';

import { Box, Card, Column, Icon, Text } from 'native-base';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { Page } from '../../../components/Page';
import { gasService } from '../../../services/blockchain/gas';
import { FullToken } from '../../../entity/blockchain/wallet-account';
import { tokenService } from '../../../services/blockchain/token';
import { goBack } from '../../../core/navigation';
import { lang } from '../../../locales';
import { GasGear, GasInfo } from '../../../entity/blockchain/gas';
import { ListItem } from '../../../components/ListItem';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Tab = createMaterialTopTabNavigator();

/**
 * gas档位选择页面
 * @constructor
 */
function GasGearTab({
  gasInfos,
  gasPriceUnit,
  selectedIndex,
  onSelect,
}: {
  gasInfos: Array<GasInfo>;
  gasPriceUnit: string;
  selectedIndex: number;
  onSelect?: (index: number) => void;
}) {
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
            onSelect?.(index);
          }

          return (
            <ListItem
              onPress={handlePress}
              icon={
                <Icon
                  as={MaterialIcons}
                  name={selectedIndex === index ? 'radio-button-checked' : 'radio-button-unchecked'}
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
}

/**
 * gas 自定义设置页面
 * @constructor
 */
function GasCustom({}: any) {
  return <Box></Box>;
}

/**
 * Gas 设置页面
 */
@observer
@autoBind
export class GasSetting extends Component<any, any> {
  state = {
    gasLimit: '21000',
  };

  timer?: NodeJS.Timer;

  constructor(props: any) {
    super(props);
    this.getToken();
    this.updateGas();
    // this.timer = setInterval(this.updateGas, 1000 * 30);
  }

  componentWillUnmount() {
    this.timer && clearInterval(this.timer);
    this.timer = undefined;
  }

  getToken(): FullToken | undefined {
    const { tokenIndex = -1 } = this.props.route?.params || {};
    const token = tokenService.selectTokens[tokenIndex];
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

    gasService.update(this.state.gasLimit);
  }

  render() {
    const { selected, selectedGasInfoIndex, gasInfos, gasPriceUnit } = gasService;
    const token = this.getToken();
    console.log(selectedGasInfoIndex);
    return (
      <Page>
        <Card>
          <Text>{lang('gas.fee')}</Text>
          <Text fontSize="xs">
            {`${selected.minGasFeeUI} ${token?.symbol} ~ ${selected.maxGasFeeUI} ${token?.symbol}`}
          </Text>
        </Card>
        <Tab.Navigator>
          <Tab.Screen name="GasGear">
            {p => (
              <GasGearTab
                gasInfos={gasInfos}
                gasPriceUnit={gasPriceUnit}
                selectedIndex={selectedGasInfoIndex}
                onSelect={gasService.select}
                {...p}
              />
            )}
          </Tab.Screen>
          <Tab.Screen name="GasCustom">{p => <GasCustom {...p} />}</Tab.Screen>
        </Tab.Navigator>
      </Page>
    );
  }
}
