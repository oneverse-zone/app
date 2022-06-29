if (typeof __dirname === 'undefined') global.__dirname = '/';
if (typeof __filename === 'undefined') global.__filename = '';
if (typeof process === 'undefined') {
  global.process = require('process');
} else {
  const bProcess = require('process');
  for (var p in bProcess) {
    if (!(p in process)) {
      process[p] = bProcess[p];
    }
  }
}

process.browser = false;
if (typeof Buffer === 'undefined') global.Buffer = require('buffer').Buffer;

// global.location = global.location || { port: 80 }
const isDev = typeof __DEV__ === 'boolean' && __DEV__;
process.env['NODE_ENV'] = isDev ? 'development' : 'production';
if (typeof localStorage !== 'undefined') {
  localStorage.debug = isDev ? '*' : '';
}

// If using the crypto shim, uncomment the following line to ensure
// crypto is loaded first, so it can populate global.crypto
require('crypto');

import { hash as sha256 } from '@stablelib/sha256';

// 修复 multiformats/hashes/sha2 包的 undefined is not an object (evaluating 'crypto.subtle.digest') 错误
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
