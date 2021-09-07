// Copyright 2018 The Flutter team. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import 'package:GameShelf/widgets/gameDetail.dart';

import 'settings.dart';
import 'package:flutter/material.dart';
import 'gameList.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'GameShelf',
      theme: ThemeData(
        primaryColor: Colors.white,
      ),
      initialRoute: '/ps',
      routes: {
        '/ps': (context) => const GameList(),
        '/xbox': (context) => const GameList(),
        '/ns': (context) => const GameList(),
        '/wl': (context) => const GameList(),
        '/detail': (context) => const GameDetail(),
        '/settings': (context) => const AppSettings(),
      },
    );
  }
}
