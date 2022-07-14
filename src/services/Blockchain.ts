import { makeAutoObservable, observable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import { btcBlockchain, ethBlockchain, polygonBlockchain } from '../constants/Blockchain';
import { Blockchain } from '../entity/Blockchain';

export const blockchains = [btcBlockchain, ethBlockchain, polygonBlockchain];

/**
 * 区块链服务
 */
export class BlockchainService {
  /**
   * 系统链列表
   */
  @observable
  blockchains: Array<Blockchain> = blockchains;

  /**
   * 用户自行添加的链
   */
  @observable
  customBlockchains: Array<Blockchain> = [];

  constructor() {
    makeAutoObservable(this, undefined, { autoBind: true });
    makePersistable(this, {
      name: 'BlockchainStore',
      properties: ['customBlockchains'],
    });
  }
}

export const blockchainService = new BlockchainService();
