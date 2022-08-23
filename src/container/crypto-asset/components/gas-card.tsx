import React from 'react';
import { StyleSheet } from 'react-native';
import { ChevronRightIcon, Column, IPressableProps, Pressable, Row, Spacer, Text } from 'native-base';
import { GasInfo } from '../../../entity/blockchain/gas';
import { lang } from '../../../locales';
import { navigate } from '../../../core/navigation';
import { route } from '../../router';

export type GasCardProps = {
  gasInfo: GasInfo;
  tokenIndex: number;
} & IPressableProps;

/**
 *
 * @constructor
 */
export function GasCard({ gasInfo, tokenIndex, ...props }: GasCardProps) {
  const { minGasFeeUI, maxGasFeeUI, gear } = gasInfo;

  function goGasSetting() {
    navigate(route.GasSetting, { tokenIndex });
  }

  return (
    <Pressable
      borderRadius="lg"
      borderColor="primary.500"
      borderWidth={StyleSheet.hairlineWidth}
      bgColor="white"
      padding={3}
      onPress={goGasSetting}
      {...props}>
      <Row alignItems="center">
        <Column>
          <Text fontSize="xs" color="coolGray.400">
            {lang('gas.estimate.range')}
          </Text>
          <Text>{`${minGasFeeUI} ~ ${maxGasFeeUI}`}</Text>
        </Column>
        <Spacer />
        <Text fontSize="xs" color="coolGray.400">
          {lang(`gas.gear.${gear.toLowerCase()}` as any)}
        </Text>
        <ChevronRightIcon fill="#9ca3af" size="xs" />
      </Row>
    </Pressable>
  );
}
