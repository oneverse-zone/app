import { Lang } from './types';

export const lang: Record<Lang, string> = {
  'app.name': 'OneVerse',
  advanced: '高级',
  'next-step': '下一步',
  setting: '设置',
  logout: '删除所有数据并退出',
  'password.new': '新密码',
  'password.confirm': '确认密码',
  mnemonic: '助记词',
  'mnemonic.setting': '助记词设置',
  'mnemonic.setting.tip':
    '为了方便记忆和记录私钥,从而简化成12/24个单词组成,和私钥具有同样的功能。\n\n助记词生成后,您必须确保助记词保密安全。如果有人得到您的助记词,他们将能够控制您的帐户。',
  'mnemonic.length': '助记词个数',
  'mnemonic.password': '助记词密码',
  'mnemonic.password.tip':
    '根据BIP39规范,创建助记词时可以设置密码来保护助记词,不同的助记词会产生不同的DID身份或钱包。\n一旦设置助记词密码,无法更改,请务必牢记。',
  'identify.setting': '去中心化身份设置',
  'identify.setting.tip': '导入现有身份或创建新身份',
  'device.password.create': '创建密码',
  'device.password.tip': '此密码将仅在此设备上解锁您的OneVerse应用\n以及保护您的应用数据。',
  'device.password.require': '必须包含8个字符',
  'protect-your-account': '保护您的帐户',
  'protect-your-account-safe': '保护您的帐户安全',
  'i-know': '我知道了',
  'tab.home': 'OneVerse',
  'tab.message': '消息',
  'tab.user': '我的',
  'tab.crypto-asset': '资产',
  wallet: '钱包',
  token: 'Token',
  nft: 'NFTs',
};

export const resErrMsg: Record<string, any> = {
  UNKNOWN: '我也不知道发生了什么:(',
  '300': '请求服务器失败 :(',
  '0000': '请求处理成功',
};
