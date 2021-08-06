import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';

import 'package:path_provider/path_provider.dart';

import '../models/catalog.dart';
import '../models/game.dart';
import 'import.dart';

class PlayStation extends StatefulWidget {
  const PlayStation({Key? key}) : super(key: key);

  @override
  _PlayStationState createState() => _PlayStationState();
}

class _PlayStationState extends State<PlayStation> {
  var _games = <Game>[];
  final _biggerFont = const TextStyle(fontSize: 18.0);
  var _loading = false;

  Future<String> get _localPath async {
    final directory = await getApplicationDocumentsDirectory();

    return directory.path + '/storage';
  }

  Future<File> get _localFile async {
    final path = await _localPath;
    return File('$path/data.json');
  }

  Future<File> _writeFile(String data) async {
    final file = await _localFile;
    final exists = await file.exists();

    if (!exists) {
      final created = await file.create(recursive: true);
      return await created.writeAsString('$data');
    } else {
      return await file.writeAsString('$data');
    }
  }

  isLoading(value) {
    setState(() {
      _loading = value;
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
      body: FutureBuilder<Catalog>(
    future: _catalog(),
    builder: _buildCatalog,
      ),
    );
  }

  Future<Catalog> _catalog() async {
    final file = await _localFile;
    final exists = await file.exists();
    final newCatalog = new Catalog(ps: [], xbox: [], ns: [], wl: []);

    if (exists) {
      final data = await file.readAsString();
      return Catalog.fromJson(json.decode(data));
    } else {
      this._writeFile(json.encode(newCatalog.toJson()));
    }

    return newCatalog;
  }

  Widget _empty() {
    return Center(
      child: Text('Is lonely around here. Import or add some games!'),
    );
  }

  Widget _buildLoading() {
    return const Center(
      child: CircularProgressIndicator(),
    );
  }

  Widget _buildCatalog(BuildContext context, AsyncSnapshot<Catalog> snapshot) {
    if (_loading) {
      return this._buildLoading();
    }

    if (snapshot.hasData) {
      _games = snapshot.data!.xbox;

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
    } else if (snapshot.hasError) {
      print('Error: ${snapshot.error}');

      return _empty();
    } else {
      return this._buildLoading();
    }
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
