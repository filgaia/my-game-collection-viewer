import 'package:flutter/material.dart';

import './appDrawer.dart';

class AppSettings extends StatefulWidget {
  const AppSettings({Key? key}) : super(key: key);

  @override
  _AppSettingsState createState() => _AppSettingsState();
}

class _AppSettingsState extends State<AppSettings> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      drawer: AppDrawer.mainDrawer(context),
      appBar: AppBar(
        title: Text('Settings'),
        backgroundColor: Colors.indigoAccent,
      ),
      body: Container(),
    );
  }
}