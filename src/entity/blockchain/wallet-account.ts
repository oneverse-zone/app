/**
 * 钱包账户信息
 */

/**
 * 身份账户信息
 * 派生路径
 * 最后一位为账户索引不填写
 * ETH: m/44'/60'/0'/0/address_index
 * m / purpose' / coin_type' / account' / change / address_index
 */
export type HDWalletAccount = {
  /**
   * 币种类型 - 对应的是币种ID
   * <a href="https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki#coin-type">解释说明</a>
   */
  coinType: number;

  /**
   * 账户索引 默认为0
   * <a href="https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki#account">解释说明</a>
   */
  accountIndex: number;

  /**
   * 默认为0
   * <a href="https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki#change">解释说明</a>
   */
  changeIndex: number;

  /**
   * 账户对应的地址索引
   * BIP-44
   * <a href="https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki#index">解释说明</a>
   */
  addressIndex: number;

  /**
   * 最终的路径
   */
  derivePath: string;
};

/**
 * 单链钱包账户
 */
export type SingleChainWalletAccount = {
  // 排除HD钱包参数
  coinType?: never;
  accountIndex?: never;
  changeIndex?: never;
  addressIndex?: never;
  derivePath?: never;
};

/**
 * 钱包账户信息
 */
export type WalletAccount = {
  /**
   * 账户名称
   */
  name: string;

  /**
   * 地址
   */
  address: string;

  /**
   * token 备注
   */
  remark?: string;

  /**
   * 账户中的tokens
   */
  tokens: Array<WalletToken>;
} & (HDWalletAccount | SingleChainWalletAccount);

/**
 * 主链币
 */
export type WalletCoin = {
  balance: number | string;
};

/**
 * 账户中的tokens
 */
export type WalletToken = {} & WalletCoin;
