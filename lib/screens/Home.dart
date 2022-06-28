import 'package:flutter/material.dart';
import 'package:oneverse/screens/crypto-asset/CryptoAsset.dart';
import 'package:oneverse/screens/home/HomeTabContent.dart';

class Home extends StatefulWidget {
  const Home({Key? key}) : super(key: key);

  // This widget is the home page of your application. It is stateful, meaning
  // that it has a State object (defined below) that contains fields that affect
  // how it looks.

  // This class is the configuration for the state. It holds the values (in this
  // case the title) provided by the parent (in this case the App widget) and
  // used by the build method of the State. Fields in a Widget subclass are
  // always marked "final".

  final String title = 'OneVerse';

  @override
  State<Home> createState() => _HomeState();
}

class _HomeState extends State<Home> with SingleTickerProviderStateMixin {
  int _currentTab = 0;

  final _contents = [
    const HomeTabContent(),
    const CryptoAsset(),
    const HomeTabContent(),
    const HomeTabContent()
  ];

  void handleTabBarItemTapped(int idx) {
    setState(() {
      _currentTab = idx;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _contents[_currentTab],
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        currentIndex: _currentTab,
        onTap: handleTabBarItemTapped,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'OneVerse'),
          BottomNavigationBarItem(icon: Icon(Icons.shop), label: '资产'),
          BottomNavigationBarItem(icon: Icon(Icons.message), label: '消息'),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: '我')
        ],
      ),
    );
  }
}
