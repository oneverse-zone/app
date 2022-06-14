// store 模块错误修复
// ReferenceError: TypeError: undefined is not an object (near '...ator.userAgent : '').match(/ (MSIE 8|MSI...')
(global.navigator as any).userAgent = '';

export {};
