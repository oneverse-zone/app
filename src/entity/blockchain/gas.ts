export enum GasGear {
  /**
   * 快速档位
   */
  FAST = 'FAST',
  /**
   * 标准档位
   */
  STANDARD = 'STANDARD',
  /**
   * 低速挡
   */
  LOW = 'LOW',
  /**
   * 用户自定义
   */
  CUSTOM = 'CUSTOM',
}

export type GasInfo = {
  /**
   * 当前链上的基本gas单价
   */
  lastBaseFeePerGas: bigint | string | number;
  /**
   * 用户愿意支付优先执行交易的的每单位gas的单价
   */
  maxPriorityFeePerGas: bigint | string | number;
  /**
   * 用于在UI上显示
   */
  maxPriorityFeePerGasUI: bigint | string | number;
  /**
   * 用户愿意支付每单位gas的单价
   */
  maxFeePerGas: bigint | string | number;
  /**
   * 用于在UI上显示
   */
  maxFeePerGasUI: bigint | string | number;
  /**
   * 用户愿意使用的最大gas量
   * 自动计算为安全的gas limit
   */
  gasLimit: bigint | string | number;

  /**
   * 最低成本
   */
  minGasFee: bigint | string | number;
  minGasFeeUI: bigint | string | number;
  /**
   * 最大成本
   */
  maxGasFee: bigint | string | number;
  maxGasFeeUI: bigint | string | number;

  /**
   * gas 所属档位
   */
  gear: GasGear;
  /**
   * 耗时 单位秒
   */
  time: number;
};
