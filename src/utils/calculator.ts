import Decimal from 'decimal.js';

/**
 * 乘法 a * b
 * @param a
 * @param b
 */
export function mul(a: any, b: any) {
  return Decimal.mul(a, b);
}
