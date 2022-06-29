import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'routers.dart';

/// 登机页面
/// 产品介绍
class OnBoarding extends StatefulWidget {
  const OnBoarding({Key? key}) : super(key: key);

  @override
  State<StatefulWidget> createState() => _OnBoardingState();
}

class _OnBoardingState extends State<OnBoarding>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('OneVerse'),
        titleTextStyle: const TextStyle(color: Colors.black),
        backgroundColor: Colors.white10,
        elevation: 0,
      ),
      body: Column(
        children: [
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                Center(
                  child: Column(
                    children: const [
                      Text('欢迎使用OneVerse'),
                      Text('OneVerse是一款Web3应用,集去中心化身份、钱包、社交、理财一体化的Web3应用')
                    ],
                  ),
                ),
                Center(
                  child: Column(
                    children: const [
                      Text('管理您的数字资产'),
                      Text('存储、支出和发送数字资产,如代币、比特币、以太币、独特的收藏品')
                    ],
                  ),
                ),
                Center(
                  child: Column(
                    children: const [
                      Text('您Web3世界的载体'),
                      Text('使用OneVerse管理您的身份并进行登录认证，以便交易、投资、赚钱、玩游戏、销售等')
                    ],
                  ),
                ),
              ],
            ),
          ),
          SafeArea(
            child: ElevatedButton(
              onPressed: goStart,
              style: ElevatedButton.styleFrom(minimumSize: const Size.fromHeight(50)),
              child: const Text('开始使用'),
            ),
          )
        ],
      ),
    );
  }

  /// 进入开始页面
  void goStart() {
    // Navigator.pushReplacementNamed(context, AppRouter.start);
    context.go(AppRouter.start);
  }
}
