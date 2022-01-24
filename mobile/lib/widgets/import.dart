import 'dart:convert';
import 'dart:io';

import 'package:archive/archive.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:path_provider/path_provider.dart';

import '../models/catalog.dart';
import '../models/game.dart';
import '../models/importedGame.dart';
import '../models/platform.dart';

class Import extends StatefulWidget {
  final Function(bool) isLoading;

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

  List<Platform> _loadPlatforms(data) {
    final platforms = <Platform>[];

    for (var platform in data) {
      platforms.add(Platform.fromJson(platform));
    }

    return platforms;
  }

  Future<List<Game>> _loadGames(backup) async {
    final file = await _localFile;
    final exists = await file.exists();
    Catalog catalog;

    if (exists) {
      final data = await file.readAsString();
      catalog = Catalog.fromJson(json.decode(data));
    } else {
      catalog = Catalog(ps: [], xbox: [], ns: [], wl: []);
    }

    final games = backup["Game"];
    final platforms = this._loadPlatforms(backup["Platform"]);
    final psGames = <Game>[];

    for (var game in games) {
      var platform = platforms.firstWhere((item) => item.id == game["platform_id"]);
      var extracted = ImportedGame.fromJson(game);
      extracted.platform = platform.name;

      if (game['is_wishlist_item'] != null) {
        catalog.wl.add(extracted.asGame());
      } else {
        switch (platform.abbreviation) {
          case 'PS4':
          case 'PS5':
            psGames.add(extracted.asGame());
            catalog.ps.add(extracted.asGame());
            break;
          case 'xbox':
          case 'xboxone':
          case 'xbox360':
          case 'series-x':
            catalog.xbox.add(extracted.asGame());
            break;
          case 'nintendo-switch':
            catalog.ns.add(extracted.asGame());
            break;
        }
      }

    }

    this._writeFile(json.encode(catalog.toJson()));

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
      final path = await _localPath;
      final filePath = "$path/data.json";

      // Extract the contents of the Zip archive to disk.
      for (final file in archive) {
        if (file.isFile) {
          final data = utf8.decode(file.content);
          final imported = json.decode(data);
          final backup = imported["backup"];

          try {
            await this._loadGames(backup);

            widget.isLoading(false);
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
