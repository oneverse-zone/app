import React from 'react';
import { StyleSheet } from 'react-native';
import { Center, ChevronRightIcon, Column, IPressableProps, Pressable, Row, Spacer, Spinner, Text } from 'native-base';
import { GasInfo } from '../../../entity/blockchain/gas';
import { lang } from '../../../locales';
import { navigate } from '../../../core/navigation';
import { route } from '../../router';

export type GasCardProps = {
  gasInfo: GasInfo;
  symbol: string;
  loading?: boolean;
} & IPressableProps;

/**
 *
 * @constructor
 */
export function GasCard({ gasInfo, symbol, loading, ...props }: GasCardProps) {
  const { minGasFeeUI, maxGasFeeUI, gear } = gasInfo;

  function goGasSetting() {
    navigate(route.GasSetting);
  }

  return (
    <Pressable
      borderRadius="lg"
      borderColor="primary.500"
      borderWidth={StyleSheet.hairlineWidth}
      bgColor="white"
      padding={3}
      position="relative"
      onPress={goGasSetting}
      {...props}>
      <Row alignItems="center">
        <Column space={1}>
          <Text fontSize="xs" color="coolGray.400">
            {`${lang('gas.estimate.range')} ${symbol}`}
          </Text>
          <Text fontSize="xs">{`${minGasFeeUI} ~ ${maxGasFeeUI}`}</Text>
        </Column>
        <Spacer />
        <Text fontSize="xs" color="coolGray.400">
          {lang(`gas.gear.${gear.toLowerCase()}` as any)}
        </Text>
        <ChevronRightIcon fill="#9ca3af" size="xs" />
      </Row>
      {loading && (
        <Center position="absolute" left={0} top={0} right={0} bottom={0} backgroundColor="rgba(255,255,255,0.5)">
          <Spinner size="sm" />
        </Center>
      )}
    </Pressable>
  );
}
