import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';

import 'package:archive/archive.dart';
import 'package:archive/archive_io.dart';

import 'package:path_provider/path_provider.dart';

import 'game.dart';

class PlayStation extends StatefulWidget {
  const PlayStation({Key? key}) : super(key: key);

  @override
  _PlayStationState createState() => _PlayStationState();
}

class _PlayStationState extends State<PlayStation> {
  final _games = <Game>[];
  final _biggerFont = const TextStyle(fontSize: 18.0);

  Future<String> get _localPath async {
    final directory = await getApplicationDocumentsDirectory();

    return directory.path;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('PS Games'),
        actions: [
          IconButton(icon: Icon(Icons.file_download), onPressed: _pushImport),
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
    // Check if we have some items. if not empty catalog
    return _games.length == 0
        ? _empty()
        : ListView.builder(
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

  Future<void> _pushImport() async {
    FilePickerResult? result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['c'],
    );

    if (result != null) {
      File file = File(result
          .files.single.path!); // On Web 'path is null'. We need to use bits
      final archive = ZipDecoder().decodeBytes(file.readAsBytesSync());
      final db = <Game>[];
      final path = await _localPath;
      print(path);

      // Extract the contents of the Zip archive to disk.
      for (final file in archive) {
        final filename = file.name;
        print(filename);
        if (file.isFile) {
          final data = utf8.decode(file.content);
          final imported = json.decode(data);
          final backup = imported["backup"];

          for (var game in backup["Game"]) {
            db.add(Game.fromJson(game));
          }

          setState(() {
            _games.addAll(db);
          });

          /* final data = file.content as List<int>;
          File(path + filename)
            ..createSync(recursive: true)
            ..writeAsBytesSync(data); */
        } else {
          Directory(path + filename)..create(recursive: true);
        }
      }
    } else {
      // User canceled the picker
    }
  }
}
