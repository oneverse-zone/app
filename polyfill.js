import './shim';

// etherjs
import '@ethersproject/shims';
// ReferenceError: Can't find variable: TextEncoder
import 'text-encoding-polyfill';

// react native url
// import { URL } from 'whatwg-url';

// global.URL = URL;

// ReferenceError: TypeError: undefined is not an object (near '...ator.userAgent : '').match(/ (MSIE 8|MSI...')
global.navigator.userAgent = '';
// 修复 multiformats/hashes/sha2 包的 undefined is not an object (evaluating 'crypto.subtle.digest') 错误
import { hash as sha256 } from '@stablelib/sha256';

crypto.subtle = {
  digest(algorithm, data) {
    switch (algorithm) {
      case 'SHA-256':
        return sha256(data);
      default:
        console.log(`为支持的算法: ${algorithm}`);
        throw new Error(`不支持的算法: ${algorithm}`);
    }
  },
};
