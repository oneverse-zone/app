export enum NetworkEnv {
  /**
   * 主网
   */
  MAIN,
  /**
   * 测试网
   */
  TEST,
  /**
   * 自定义网络
   */
  CUSTOM,
}

/**
 * 链节点
 */
export type NetworkNode = {
  /**
   * 链信息ID
   */
  blockchainId: string;
  /**
   * 链ID
   */
  chainId: number;
  /**
   * 节点名称
   */
  name: string;
  /**
   * 网络名称
   * url 或 网络名称
   */
  network: string;

  /**
   * 网络环境
   */
  networkEnv: NetworkEnv;

  /**
   * 内置网络
   */
  builtIn: boolean;
  /**
   * 网络延迟
   */
  networkDelay?: 'timeout' | number;
};
