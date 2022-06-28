import 'package:go_router/go_router.dart';

import 'Home.dart';
import 'Lock.dart';
import 'OnBoarding.dart';
import 'Splash.dart';
import 'Start.dart';

// Map<String, WidgetBuilder> routes = <String, WidgetBuilder>{
//   Router.splash: (context) => const Splash(),
//   Router.onBoarding: (context) => const OnBoarding(),
//   Router.start: (context) => const Start(),
//   Router.lock: (context) => const Lock(),
//   Router.home: (context) => const Home()
// };

class AppRouter {
  static const String splash = '/splash';
  static const String onBoarding = '/on-boarding';
  static const String start = '/start';
  static const String home = '/home';
  static const String lock = '/lock';

  static GoRouter router = GoRouter(
    routes: <GoRoute>[
      GoRoute(
        path: splash,
        builder: (context, state) => const Splash(),
      ),
      GoRoute(
        path: onBoarding,
        builder: (context, state) => const OnBoarding(),
      ),
      GoRoute(path: start, builder: (context, state) => const Start()),
      GoRoute(path: lock, builder: (context, state) => const Lock()),
      GoRoute(path: home, builder: (context, state) => const Home())
    ],
  );
}
