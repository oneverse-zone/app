import { Token } from '../entity/blockchain/token';
import { makeMobxState } from '../mobx/mobx-manager';

export class GasService {
  constructor() {
    makeMobxState(this);
  }

  /**
   * 查询gas费
   * @param token
   */
  query(token: Token) {}
}

export const gasService = new GasService();
