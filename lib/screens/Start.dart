import 'package:flutter/material.dart';
import 'package:oneverse/services/Session.dart';

/// 开始页面
/// 引导用户创建或者导入身份
class Start extends StatefulWidget {
  const Start({Key? key}) : super(key: key);

  @override
  State<StatefulWidget> createState() => _StartState();
}

class _StartState extends State<Start> {
  final Session session = Session();
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SizedBox(
        width: double.infinity,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: double.infinity,
              margin: const EdgeInsets.symmetric(horizontal: 15),
              child: ElevatedButton(
                onPressed: handleCreate,
                child: const Text('创建您的Web3身份'),
              ),
            ),
            Container(
              width: double.infinity,
              margin: const EdgeInsets.symmetric(horizontal: 15),
              child: MaterialButton(
                onPressed: handleImport,
                child: const Text('导入您的Web3身份'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void handleCreate() {
    session.registerAndLogin();
  }

  void handleImport() {}
}
