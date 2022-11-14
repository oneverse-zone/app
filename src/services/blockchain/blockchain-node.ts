import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import { makeResettable } from '../../mobx/mobx-reset';
import { Blockchain } from '../../entity/blockchain/blockchain';
import { NetworkNode } from '../../entity/blockchain/network-node';
import { ethereum, ethereumGoerli, ethereumRinkeby } from './chainlist/ethereum';
import { ethereumGoerliNets, ethereumMainNets, ethereumRinkebyNets } from './nodelist/ethereum';
import {makeMobxState} from "../../mobx/mobx-manager";

/**
 * 节点服务
 */
export class BlockchainNodeService {
  /**
   * 系统默认的节点
   */
  nodes: Record<string, Array<NetworkNode>> = {
    /**
     * 以太坊主链
     */
    [ethereum.id]: ethereumMainNets,
    [ethereumRinkeby.id]: ethereumRinkebyNets,
    [ethereumGoerli.id]: ethereumGoerliNets,
  };

  /**
   * 用户自行添加的节点
   */
  customNodes: Record<string, Array<NetworkNode>> = {};

  /**
   * 默认节点
   */
  defaultNode: Record<string, NetworkNode> = {};

  constructor() {
    makeMobxState(this,{
      storageOptions: {
        name: 'BlockchainNodeStore',
        properties: ['customNodes', 'defaultNode'],
      }
    });
    this.testAllNode();
    this.startTestTask();
  }

  /**
   * 获取所有节点,包括自定义节点
   */
  get allNodes(): Record<string, Array<NetworkNode>> {
    const result: Record<string, Array<NetworkNode>> = {};
    Object.keys(this.nodes).forEach(id => {
      result[id] = [...(result[id] ?? []), ...(this.nodes[id] ?? [])];
    });
    Object.keys(this.customNodes).forEach(id => {
      result[id] = [...(result[id] ?? []), ...(this.customNodes[id] ?? [])];
    });
    return result;
  }

  /**
   * 获取最优节点
   */
  getFastNode(blockchain: Blockchain): NetworkNode {
    console.log(`获取${blockchain.name}最快的节点`);
    const blockchainId = blockchain.id;
    let node = this.defaultNode[blockchainId];
    if (node) {
      console.log(`使用用户设置的默认节点 ${node.name} ${node.networkDelay}`);
      return node;
    }
    node = (this.allNodes[blockchainId] || []).sort((a, b) => {
      return (
        (a.networkDelay === 'timeout' ? 9999999999 : a.networkDelay || 9999999999) -
        (b.networkDelay === 'timeout' ? 9999999999 : b.networkDelay || 9999999999)
      );
    })[0];
    if (node) {
      console.log(`从节点列表中获得最快的节点 ${node.name} ${node.networkDelay}`);
      return node;
    }
    console.error(`找不到可用的节点 ${blockchainId} ${blockchain.name}`);
    throw new Error('找不到链对应的节点');
  }

  /**
   * 测试任务
   */
  startTestTask() {
    setInterval(this.testAllNode, 30 * 1000);
  }

  /**
   * 节点网络速度
   */
  testAllNode() {
    Object.keys(this.allNodes).forEach(this.testNodes);
  }

  async testNodes(blockchainId: string) {
    const nodes = this.nodes[blockchainId];
    for (const item of nodes) {
      item.networkDelay = await this.testNode(item);
    }
    this.nodes[blockchainId] = nodes;
  }

  testNode(node: NetworkNode): NetworkNode['networkDelay'] {
    return 0;
  }
}

export const blockchainNodeService = new BlockchainNodeService();
