import { runInAction } from 'mobx';
import { EventEmitter } from 'events';

const mobxResetEvent = new EventEmitter();

export const MOBX_RESET = 'reset';

/**
 * 设置对象为可重置
 * 必须在makeAutoObservable之前调用
 * @param target
 */
export function makeResettable<T extends object>(target: T) {
  const keys = Object.keys(target);
  const initState: Record<string, any> = {};
  keys.forEach((key: string) => {
    initState[key] = (target as any)[key];
  });

  mobxResetEvent.addListener(MOBX_RESET, () => {
    runInAction(() => {
      keys.forEach((key: string) => {
        (target as any)[key] = initState[key];
      });
    });
  });
}

/**
 * 重置
 */
export function resetState() {
  mobxResetEvent.emit(MOBX_RESET);
}
