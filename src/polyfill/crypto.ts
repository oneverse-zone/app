import 'react-native-get-random-values';
import {hash as sha256} from '@stablelib/sha256';

if (!crypto.subtle) {
  (crypto as any).subtle = {};
}
(crypto.subtle as any).digest = async function (
  algorithm: AlgorithmIdentifier,
  data: any,
): Promise<ArrayBuffer> {
  switch (algorithm) {
    case 'SHA-256':
      return sha256(data);
    default:
      console.log(`为支持的算法: ${algorithm}`);
      throw new Error(`不支持的算法: ${algorithm}`);
  }
};
