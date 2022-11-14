import { makeResettable } from './mobx-reset';
import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import { PersistenceStorageOptions, ReactionOptions } from 'mobx-persist-store/lib/esm2017/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Options<T, P extends keyof T> = {
  resettable?: boolean;
  storageOptions?: PersistenceStorageOptions<T, P>;
  reactionOptions?: ReactionOptions;
};

export function makeMobxState<T extends { [key: string]: any }>(target: T, options?: Options<T, keyof T>) {
  const { resettable, storageOptions, reactionOptions } = options || {};

  if (resettable) {
    makeResettable(target);
  }
  makeAutoObservable(
    target,
    {},
    {
      autoBind: true,
    },
  );
  if (storageOptions) {
    makePersistable(target, { storage: AsyncStorage, ...storageOptions }, reactionOptions);
  }
}
