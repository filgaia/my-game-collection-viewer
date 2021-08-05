import 'dart:io';

import 'package:flutter/material.dart';

import 'package:path_provider/path_provider.dart';

import 'game.dart';
import 'import.dart';

class PlayStation extends StatefulWidget {
  const PlayStation({Key? key}) : super(key: key);

  @override
  _PlayStationState createState() => _PlayStationState();
}

class _PlayStationState extends State<PlayStation> {
  final _games = <Game>[];
  final _biggerFont = const TextStyle(fontSize: 18.0);
  var _loading = false;

  Future<String> get _localPath async {
    final directory = await getApplicationDocumentsDirectory();

    return directory.path;
  }

  Future<File> get _localFile async {
    final path = await _localPath;
    return File('$path/data.json');
  }

  isLoading(value, [db]) {
    setState(() {
      _loading = value;

      if (db != null) {
        _games.addAll(db);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('PS Games'),
        actions: [
          Import(isLoading),
        ],
        backgroundColor: Colors.indigoAccent,
      ),
      body: _buildCatalog(),
    );
  }

  Widget _empty() {
    return Center(
      child: Text('Is lonely around here. Import or add some games!'),
    );
  }

  Widget _buildCatalog() {
    if (_loading) {
      return const Center(
        child: CircularProgressIndicator(),
      );
    }

    if (_games.length == 0) {
      return _empty();
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16.0),
      itemBuilder: (context, i) {
        return _buildRow(_games[i]);
      },
      itemCount: _games.length,
    );
  }

  Widget _buildRow(Game game) {
    return ListTile(
      title: Text(
        game.name,
        style: _biggerFont,
      ),
    );
  }
}
