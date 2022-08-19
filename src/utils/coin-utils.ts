/**
 * 币工具
 */

/**
 * 格式化余额信息
 * 用于页面展示
 */
export function formatBalance(balance: number | string) {
  if (typeof balance === 'number') {
    return balance.toFixed(8);
  }
  return Number.parseFloat(balance).toFixed(8);
}
