// Copyright 2018 The Flutter team. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import 'settings.dart';
import 'package:flutter/material.dart';
import 'ps.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Gameshelf',
      theme: ThemeData(
        primaryColor: Colors.white,
      ),
      initialRoute: '/ps',
      routes: {
        '/ps': (context) => const PlayStation(),
        '/xbox': (context) => const PlayStation(),
        '/ns': (context) => const PlayStation(),
        '/wl': (context) => const PlayStation(),
        '/settings': (context) => const AppSettings(),
      },
    );
  }
}
