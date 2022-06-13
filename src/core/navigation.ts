import {createNavigationContainerRef} from '@react-navigation/native';
import {PartialState} from '@react-navigation/routers';

export const navigationRef = createNavigationContainerRef<any>();

/**
 * 导航
 * @param name
 * @param params
 */
export function navigate(name: string, params?: any) {
  navigationRef.isReady() && navigationRef.navigate(name, params);
}

export function reset(state: PartialState<any> | any) {
  navigationRef.isReady() && navigationRef.reset(state);
}

export function resetTo(name: string) {
  navigationRef.isReady() &&
    navigationRef.reset({
      index: 0,
      routes: [{name}],
    });
}

export function replace(name: string, params?: any) {
  if (navigationRef.isReady()) {
    const {index, routes}: any = navigationRef.getState();
    routes[index] = {name, params};
    navigationRef.reset({
      index,
      routes,
    });
  }
}

/**
 * 页面返回
 */
export function goBack() {
  navigationRef.isReady() && navigationRef.goBack();
}

export function setParams(params: any) {
  navigationRef.isReady() && navigationRef.setParams(params);
}
