import { LangKey } from './types';
import { LangValue } from './index';

export const lang: Record<LangKey, LangValue> = {
  'app.name': 'OneVerse',
  congratulations: '恭喜',
  advanced: '高级',
  'next-step': '下一步',
  ok: '确定',
  balance: '余额',
  add: '添加',
  finish: '完成',
  cancel: '取消',
  copy: '复制',
  'copy.success': '复制成功',
  setting: '设置',
  'look-over': '查看',
  login: '登录',
  logout: '删除所有数据并退出',
  all: '全部',
  minute: '分钟',
  second: '秒',
  'i-know': '我知道了',
  'i-understand-go-on': '我明白，继续',
  'welcome-back': '欢迎回来!',
  discovery: '发现',
  follow: '关注',
  recommend: '推荐',
  password: '密码',
  'password.new': '新密码',
  'password.confirm': '确认密码',
  'password.error': '密码不正确',
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
  'identify.import': '从助记词导入身份',
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
  'protect-your-wallet-safe': '保护您的钱包安全',
  'backup.two.title': '写下您的助记词',
  'backup.two.describe': '这是您的助记词。将它保存在安全的地方。您需要在下一步中重新输入此助记词（按顺序）。',
  'backup.two.look-over-mnemonic': '点击查看按钮显示助记词',
  'backup.two.look-over-mnemonic.tip': '确保没有人在看您的屏幕',
  'backup.three.title': '确认助记词',
  'backup.three.describe': '按照之前呈现的顺序选择每个字词',
  'backup.three.button': '完整备份',
  'backup.four.describe': '您已成功保护自己的Web3账户。记住妥善保管您的助记词，这次您的责任!',
  'backup.four.tip': '如果您丢失助记词,OneVerse无法找回您的账户。您可在"设置">"安全和隐私"中重新进行助记词备份。',
  wallet: '钱包',
  'wallet.welcome.title': '欢迎使用OneVerse钱包',
  'wallet.welcome.slogan': '由此探索、赚取您元宇宙中的第一桶金',
  'wallet.name': '钱包名称',
  // 'wallet.hd': '身份钱包',
  // 'wallet.hd.init': '使用去中心化身份初始化钱包',
  'wallet.single-chain': '单链钱包',
  'wallet.single-chain.init': '使用传统方式初始化钱包',
  'wallet.exist': '钱包已经存在',
  'wallet.select': '选择钱包',
  'wallet.manager': '钱包管理',
  'wallet.create': '创建钱包',
  'wallet.create.did': '创建DID钱包',
  'wallet.create.did.describe': '使用您的DID身份助记词创建钱包。\n同时管理您的DID身份和钱包',
  'wallet.create.did.tip': '您必须确保助记词保密安全。如果有人得到您的助记词,他们将能够控制您DID身份和钱包资产',
  'wallet.create.hd': '创建身份钱包',
  'wallet.create.hd.describe': '创建新的助记词生成钱包',
  'wallet.create.hd.tip': '您必须确保助记词保密安全。如果有人得到您的助记词,他们将能够控制您的钱包资产',
  'wallet.create.name.tip': '请输入您的钱包名称',
  'wallet.recover': '恢复/导入钱包',
  'wallet.recover.describe': '通过您持有的助记词或私钥恢复已有的钱包',
  'wallet.account.add': '添加帐户',
  'wallet.account.name': '账户名称',
  'wallet.account.address.index': '账户地址编号',
  'wallet.account.address.index.tip':
    '钱包地址从索引0开始以顺序递增的方式编号。此数字用作BIP32派生中的子索引。(使用同一个助记词生成多个钱包账户)',
  'wallet.account.address.copy': '复制地址',
  'blockchain.select': '链选择',
  'blockchain.main': '主链',
  'blockchain.test': '测试链',
  'blockchain.custom': '自定义链',
  'blockchain.custom.add': '添加自定义链',
  token: 'Token',
  'token.send': '转账',
  'token.send.amount': '转账金额',
  'token.receive': '收款',
  'token.receive.address': '接收地址',
  'token.receive.tip': symbol => `此地址仅支持从${symbol}接收,请勿用于其他币种`,
  'token.swap': '兑换',
  'token.select': 'Token 选择',
  'token.in': '转入',
  'token.out': '转出',
  gas: '矿工费',
  'gas.fee': '矿工费',
  'gas.setting': '矿工费设置',
  'gas.estimate.range': '预估范围',
  'gas.gear.fast': '最快',
  'gas.gear.standard': '标准',
  'gas.gear.low': '缓慢',
  'gas.limit': '燃料限制',
  'gas.limit.describe': '燃料限制是指您愿意花费的最大燃料量',
  'gas.price': '燃料价格',
  'gas.price.describe': '燃料价格规定了您愿意为每单位燃料支付的Token数量',
  nft: 'NFTs',
  'tab.home': 'OneVerse',
  'tab.message': '消息',
  'tab.user': '我的',
  'tab.crypto-asset': '资产',
};

export const resErrMsg: Record<string, any> = {
  UNKNOWN: '我也不知道发生了什么:(',
  '300': '请求服务器失败 :(',
  '0000': '请求处理成功',
};
