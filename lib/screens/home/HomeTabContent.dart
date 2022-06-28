import 'package:flutter/material.dart';

class HomeTabContent extends StatefulWidget {
  const HomeTabContent({Key? key}) : super(key: key);

  @override
  State<StatefulWidget> createState() => _HomeTabContentState();
}

class _HomeTabContentState extends State<HomeTabContent> {
  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Text('Home'),
    );
  }
}
