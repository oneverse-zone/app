import { IPressableProps, Pressable, Text } from 'native-base';
import React from 'react';

export type WordProps = {
  word: string;
  onPress?: (word: string) => void;
} & Omit<IPressableProps, 'onPress'>;

export function Word({ word, onPress, ...props }: WordProps) {
  return (
    <Pressable
      justifyContent="center"
      alignItems="center"
      rounded="sm"
      paddingY={0.5}
      paddingX={3}
      backgroundColor="coolGray.100"
      marginBottom={3}
      mr={3}
      onPress={onPress && (() => onPress(word))}
      {...props}>
      <Text fontSize="sm">{word}</Text>
    </Pressable>
  );
}
