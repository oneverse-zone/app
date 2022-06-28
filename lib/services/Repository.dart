import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class DataKey {
  static const String lockScreenPassword = "LOCK_SCREEN_PASSWORD";
}

/// 数据仓库服务
class Repository {
  final _storage = const FlutterSecureStorage();

  /// 查找用户的锁屏密码
  Future<String?> findLockScreenPassword() async {
    return await _storage.read(key: DataKey.lockScreenPassword);
  }

  /// 保存用户锁屏密码
  /// [password] 用户锁屏密码
  void saveLockScreenPassword(String password) async {
    _storage.write(key: DataKey.lockScreenPassword, value: password);
  }
}
