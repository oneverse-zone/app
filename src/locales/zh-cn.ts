import { Lang } from './types';

export const lang: Record<Lang, string> = {
  'app.name': 'OneVerse',
  congratulations: '恭喜',
  advanced: '高级',
  'next-step': '下一步',
  finish: '完成',
  cancel: '取消',
  setting: '设置',
  'look-over': '查看',
  login: '登录',
  logout: '删除所有数据并退出',
  'i-know': '我知道了',
  'i-understand-go-on': '我明白，继续',
  'welcome-back': '欢迎回来!',
  password: '密码',
  'password.new': '新密码',
  'password.confirm': '确认密码',
  mnemonic: '助记词',
  'mnemonic.copy': '复制助记词',
  'mnemonic.copy.tip': '复制成功.请注意保管您的助记词.点击下一步将会清理您的剪切板',
  'mnemonic.setting': '助记词设置',
  'mnemonic.setting.tip':
    '为了方便记忆和记录私钥,从而简化成12/24个单词组成,和私钥具有同样的功能。\n\n助记词生成后,您必须确保助记词保密安全。如果有人得到您的助记词,他们将能够控制您的帐户。',
  'mnemonic.length': '助记词个数',
  'mnemonic.password': '助记词密码',
  'mnemonic.password.tip':
    '根据BIP39规范,创建助记词时可以设置密码来保护助记词,不同的助记词会产生不同的DID身份或钱包。\n一旦设置助记词密码,无法更改,请务必牢记。',
  'identify.setting': '去中心化身份设置',
  'identify.setting.tip': '导入现有身份或创建新身份',
  'identify.create.tip': '正在创建您的身份,这不需要多长时间',
  'identify.reset': '重置身份',
  'identify.delete': '删除我的身份',
  'identify.delete.success': '身份删除成功',
  'identify.delete.title': '您确定要删除您的身份吗?',
  'identify.delete.confirm.title': '输入"delete"以永久删除当前身份',
  'identify.delete.tip1': '您目前的身份、钱包、资产等将',
  'identify.delete.tip2': '从这个应用程序中永久删除。',
  'identify.delete.tip3': '此操作无法撤回。',
  'identify.delete.tip4': '您只能用您的',
  'identify.delete.tip5': '助记词恢复此身份',
  'identify.delete.tip6': 'OneVerse不拥有您的助记词。',
  'device.password.create': '创建密码',
  'device.password.tip': '此密码将仅在此设备上解锁您的OneVerse应用\n以及保护您的应用数据。',
  'device.password.require': '必须包含8个字符',
  'protect-your-account-safe': '保护您的身份安全',
  'backup.two.title': '写下您的助记词',
  'backup.two.describe': '这是您的助记词。将它保存在安全的地方。您需要在下一步中重新输入此助记词（按顺序）。',
  'backup.two.look-over-mnemonic': '点击查看按钮显示助记词',
  'backup.two.look-over-mnemonic.tip': '确保没有人在看您的屏幕',
  'backup.three.title': '确认助记词',
  'backup.three.describe': '按照之前呈现的顺序选择每个字词',
  'backup.three.button': '完整备份',
  'backup.four.describe': '您已成功保护自己的Web3账户。记住妥善保管您的助记词，这次您的责任!',
  'backup.four.tip': '如果您丢失助记词,OneVerse无法找回您的账户。您可在"设置">"安全和隐私"中重新进行助记词备份。',
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
