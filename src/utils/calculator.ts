// @ts-ignore
import { BN } from 'bn.js';
import { BigNumber } from '@ethersproject/bignumber';
import Decimal from 'decimal.js';

export function toDecimal(value: BN | BigNumber | number | string): Decimal {
  if (value instanceof BN || value instanceof BigNumber) {
    return new Decimal(value.toString());
  }
  return new Decimal(value);
}

/**
 * 乘法 a * b
 * @param a
 * @param b
 */
export function mul(a: any, b: any): Decimal {
  return toDecimal(a).mul(toDecimal(b));
}

export function add(a: any, b: any): Decimal {
  return toDecimal(a).add(toDecimal(b));
}
