import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import { Blockchain } from '../../entity/blockchain/blockchain';
import { makeResettable } from '../../mobx/mobx-reset';
import { mainChains, testChains } from './chainlist';
import {makeMobxState} from "../../mobx/mobx-manager";

/**
 * 区块链服务
 */
export class BlockchainService {
  /**
   * 主网链
   */
  mains: Array<Blockchain> = mainChains;

  /**
   * 测试网链
   */
  tests: Array<Blockchain> = testChains;

  /**
   * 自定义网链
   */
  customs: Array<Blockchain> = [];

  /**
   * 当前选择的链
   */
  selectIndex = 0;

  constructor() {
    makeMobxState(this,{
      storageOptions: {
        name: 'BlockchainStore',
        properties: ['customs', 'selectIndex'],
      }
    });
  }

  get blockchains() {
    return [...this.mains, ...this.tests, ...this.customs];
  }

  /**
   * 选择链
   * @param index 索引
   */
  selectBlockchain(index: number) {
    if (this.blockchains[index]) {
      this.selectIndex = index;
    }
  }

  /**
   * 当前选择的链
   */
  get selected(): Blockchain | undefined {
    return this.blockchains[this.selectIndex];
  }

  /**
   *
   */
  supportHD(id: string): boolean {
    return false;
  }
}

export const blockchainService = new BlockchainService();
