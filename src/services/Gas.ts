import { makeAutoObservable } from 'mobx';
import { Token } from '../entity/Token';

export class GasService {
  constructor() {
    makeAutoObservable(this, undefined, {
      autoBind: true,
    });
  }

  /**
   * 查询gas费
   * @param token
   */
  query(token: Token) {}
}

export const gasService = new GasService();
