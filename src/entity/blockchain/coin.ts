export type BaseToken = {
  /**
   * 名称
   */
  name: string;

  /**
   * 代币符号
   */
  symbol: string;

  /**
   * 小数点
   */
  decimals: number;
};

/**
 * 币信息
 */
export type Coin = {
  /**
   * 币种id
   */
  id: number;

  /**
   * 链ID
   */
  blockchainId: string;
} & BaseToken;
