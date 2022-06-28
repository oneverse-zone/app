import 'package:mobx/mobx.dart';

part 'Session.g.dart';

class Session = SessionBase with _$Session;

/// 回话服务
/// 记录当前回话中的用户信息
abstract class SessionBase with Store {
  @observable
  bool locked = true;

  @action
  void unlock(password) {
    locked = false;
  }

  /// 注册账号并自动登录
  /// 随机生成助记词
  @action
  registerAndLogin() {
    // DIDService.newInstance();
  }
}
