import { Lang } from './types';

export const lang: Record<Lang, string> = {
  'tab.home': 'OneVerse',
  'tab.message': '消息',
  'tab.user': '我的',
  'tab.crypto-asset': '资产',
  wallet: '钱包',
  nft: 'NFTs',
};

export const resErrMsg: Record<string, any> = {
  UNKNOWN: '我也不知道发生了什么:(',
  '300': '请求服务器失败 :(',
  '0000': '请求处理成功',
};
