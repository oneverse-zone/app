import 'dart:async';

import 'package:flutter/material.dart';
import 'package:oneverse/services/Repository.dart';
import 'package:oneverse/services/Session.dart';

import 'routers.dart';

/// 欢饮页面
class Splash extends StatefulWidget {
  const Splash({Key? key}) : super(key: key);

  @override
  State<StatefulWidget> createState() => _SplashState();
}

class _SplashState extends State<Splash> {
  final Session session = Session();
  final Repository repository = Repository();

  String _password = "";
  late Timer _timer;

  @override
  void initState() {
    super.initState();
    init();
  }

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Text('Welcome to OneVerse'),
    );
  }

  void init() async {
    String? pwd = await repository.findLockScreenPassword();
    setState(() {
      _password = pwd ?? "";
    });
    // 3秒后执行跳转
    const timeout = Duration(seconds: 3);
    _timer = Timer(timeout, () {
      handleNext();
    });
  }

  /// 处理页面最终跳转逻辑
  void handleNext() {
    _timer.cancel();

    bool authenticated = false;
    if (!session.locked && !authenticated) {
      // 用户已经解锁,但是用户未授权,跳转到Start页面
      Navigator.pushReplacementNamed(context, AppRouter.start);
    } else if (_password.isNotEmpty) {
      // 设备未解锁,但是用户设置了密码,跳转到锁屏页面
      Navigator.pushReplacementNamed(context, AppRouter.lock);
    } else {
      // 设备未解锁，用户未设置锁屏密码,跳转到启动页面
      Navigator.pushReplacementNamed(context, AppRouter.onBoarding);
    }
  }
}
