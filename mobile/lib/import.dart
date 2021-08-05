import 'package:flutter/material.dart';

import 'dart:convert';
import 'dart:io';

import 'package:archive/archive.dart';
import 'package:file_picker/file_picker.dart';
import 'package:path_provider/path_provider.dart';

import 'game.dart';

class Import extends StatefulWidget {
  final Function(bool, [List<Game>]) isLoading;

  Import(this.isLoading);

  @override
  _ImportState createState() => _ImportState();
}

class _ImportState extends State<Import> {
  @override
  Widget build(BuildContext context) {
    return IconButton(icon: Icon(Icons.file_download), onPressed: _pushImport);
  }

  Future<String> get _localPath async {
    final directory = await getApplicationDocumentsDirectory();

    return directory.path;
  }

  Future<File> get _localFile async {
    final path = await _localPath;
    return File('$path/data.json');
  }

  Future<File> writeFile(int data) async {
    final file = await _localFile;

    return file.writeAsString('$data');
  }

  Future<List<Game>> loadGames(games) async {
    // TODO:
    // Save the information to a file before update the UI
    // Fix the Platform references names

    // final file = await _localFile;
    // final data = await file.readAsString();
    final psGames = <Game>[];

    for (var game in games) {
      psGames.add(Game.fromJson(game));

      // Check his platform
      // var platform = game["platform_id"];
    }

    /* final fileData = file.content as List<int>;
            File(filePath)
              ..createSync(recursive: true)
              ..writeAsBytesSync(fileData); */

    return psGames;
  }

  Future<void> _pushImport() async {
    FilePickerResult? result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['c'],
    );

    if (result != null) {
      widget.isLoading(true);

      File file = File(result
          .files.single.path!); // On Web 'path is null'. We need to use bits
      final archive = ZipDecoder().decodeBytes(file.readAsBytesSync());
      final db = <Game>[];
      final path = await _localPath;
      final filePath = "$path/storage/data.json";

      // Extract the contents of the Zip archive to disk.
      for (final file in archive) {
        if (file.isFile) {
          final data = utf8.decode(file.content);
          final imported = json.decode(data);
          final backup = imported["backup"];

          try {
            db.addAll(await loadGames(backup["Game"]));

            widget.isLoading(false, db);
          } catch (e, s) {
            widget.isLoading(false);
            print("Error: $e");
            print("STACK TRACE: \n $s");
          }
        } else {
          Directory(filePath)..create(recursive: true);
        }
      }
    } else {
      // User canceled the picker
    }
  }
}
