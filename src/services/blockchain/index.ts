import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import { Blockchain } from '../../entity/blockchain/blockchain';
import { makeResettable } from '../../mobx/mobx-reset';
import { Protocol } from '../../entity/blockchain/protocol';

export const bitcoin: Blockchain = {
  id: 'bitcoin',
  name: 'Bitcoin',
  description:
    'Bitcoin is a cryptocurrency and worldwide payment system. It is the first decentralized digital currency, as the system works without a central bank or single administrator.',
  website: 'https://bitcoin.org',
  explorer: 'https://blockchain.info',
  research: 'https://research.binance.com/en/projects/bitcoin',
  protocol: Protocol.Bitcoin,
  coinId: 0,
};

export const ethereum: Blockchain = {
  id: 'ethereum',
  name: 'Ethereum',
  description: 'Open source platform to write and distribute decentralized applications.',
  website: 'https://ethereum.org/',
  explorer: 'https://etherscan.io/',
  research: 'https://research.binance.com/en/projects/ethereum',
  protocol: Protocol.EVM,
  coinId: 60,
};

export const polygon: Blockchain = {
  id: 'polygon',
  name: 'Polygon',
  description:
    'Polygon (Matic) strives to solve the scalability and usability issues, while not compromising on decentralization and leveraging the existing developer community and ecosystem',
  website: 'https://polygon.technology/',
  explorer: 'https://polygonscan.com/',
  research: 'https://docs.matic.network/',
  protocol: Protocol.EVM,
  coinId: 966,
};

/**
 * 区块链服务
 */
export class BlockchainService {
  /**
   * 主网链
   */
  mainNets: Array<Blockchain> = [bitcoin, ethereum, polygon];

  /**
   * 测试网链
   */
  testNets: Array<Blockchain> = [];

  /**
   * 自定义网链
   */
  customNets: Array<Blockchain> = [];

  /**
   * 当前选择的链
   */
  selectIndex = 0;

  constructor() {
    makeResettable(this);
    makeAutoObservable(this, undefined, { autoBind: true });
    makePersistable(this, {
      name: 'BlockchainStore',
      properties: ['customNets', 'selectIndex'],
    }).then();
  }

  get blockchains() {
    return [...this.mainNets, ...this.testNets, ...this.customNets];
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
  get selected() {
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
