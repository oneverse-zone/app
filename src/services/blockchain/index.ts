import { makeAutoObservable, observable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import { btcBlockchain, ethBlockchain, polygonBlockchain } from '../../constants/Blockchain';
import { Blockchain } from '../../entity/Blockchain';
import { makeResettable } from '../../mobx/mobx-reset';

export const blockchains = [btcBlockchain, ethBlockchain, polygonBlockchain];

/**
 * 区块链服务
 */
export class BlockchainService {
  /**
   * 公链
   */
  @observable
  publicBlockchains: Array<Blockchain> = blockchains;

  /**
   * 支持HD钱包的链
   */
  supportHDBlockchains: Array<Blockchain> = [ethBlockchain];

  /**
   * 用户自行添加的链
   */
  @observable
  customBlockchains: Array<Blockchain> = [];

  constructor() {
    makeResettable(this);
    makeAutoObservable(this, undefined, { autoBind: true });
    makePersistable(this, {
      name: 'BlockchainStore',
      properties: ['customBlockchains'],
    });
  }

  get allBlockchains() {
    return [...this.publicBlockchains, ...this.customBlockchains];
  }

  /**
   *
   */
  supportHD(id: string): boolean {
    return this.supportHDBlockchains.findIndex(item => item.id === id) > -1;
  }
}

export const blockchainService = new BlockchainService();
