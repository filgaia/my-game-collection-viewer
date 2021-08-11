import 'dart:convert';
import 'dart:io';

import 'package:Gameshelf/models/screenArguments.dart';
import 'package:Gameshelf/widgets/appDrawer.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import 'package:path_provider/path_provider.dart';

import '../models/catalog.dart';
import '../models/game.dart';
import 'gameCard.dart';
import 'import.dart';

class GameList extends StatefulWidget {
  const GameList({Key? key}) : super(key: key);

  @override
  _GameListState createState() => _GameListState();
}

class _GameListState extends State<GameList> {
  var _games = <Game>[];
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
    final args = ScreenArguments.byRoute(ModalRoute.of(context)!.settings.name);

    return Scaffold(
      drawer: AppDrawer.mainDrawer(context),
      appBar: AppBar(
        title: Text(args.title),
        actions: [
          Import(isLoading),
        ],
        backgroundColor: args.color,
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
    final name = ModalRoute.of(context)!.settings.name;

    if (_loading) {
      return this._buildLoading();
    }

    if (snapshot.hasData) {
      this._getGames(name, snapshot.data);

      if (_games.length == 0) {
        return _empty();
      }

      /*return ListView.builder(
        padding: const EdgeInsets.all(16.0),
        itemBuilder: (context, i) {
          return _buildRow(_games[i]);
        },
        itemCount: _games.length,
      ); */
      return GridView.builder(
        itemCount: _games.length,
        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          crossAxisSpacing: 5.0,
          mainAxisSpacing: 5.0,
          childAspectRatio: 0.6,
        ),
        itemBuilder: _buildItem,
      );
    } else if (snapshot.hasError) {
      print('Error: ${snapshot.error}');

      return _empty();
    } else {
      return this._buildLoading();
    }
  }

  void _getGames(String? name, Catalog? data) {
    switch (name) {
      case '/xbox':
        _games = data!.xbox;
        break;
      case '/ns':
        _games = data!.ns;
        break;
      case '/wl':
        _games = data!.wl;
        break;
      default:
        _games = data!.ps;
        break;
    }
  }

  Widget _buildItem(BuildContext context, int index) {
    Game game = _games[index];
    return GameCard(game);
  }
}
