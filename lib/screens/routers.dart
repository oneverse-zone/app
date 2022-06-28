import 'package:flutter/material.dart';

import 'OnBoarding.dart';
import 'Splash.dart';
import 'Start.dart';
import 'Lock.dart';
import 'Home.dart';


Map<String, WidgetBuilder> routes = <String, WidgetBuilder>{
  RoutePath.splash: (context) => const Splash(),
  RoutePath.onBoarding: (context) => const OnBoarding(),
  RoutePath.start: (context) => const Start(),
  RoutePath.lock: (context) => const Lock(),
  RoutePath.home: (context) => const Home()
};

class RoutePath {
  static const String splash = '/splash';
  static const String onBoarding = '/on-boarding';
  static const String start = '/start';
  static const String home = '/home';
  static const String lock = '/lock';

}

