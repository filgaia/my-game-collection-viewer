import 'package:GameShelf/models/iGame.dart';
import 'package:json_annotation/json_annotation.dart';

import 'game.dart';
import 'iGame.dart';

part 'importedGame.g.dart';

@JsonSerializable()
class ImportedGame implements IGame {
  int id;
  String name;

  @JsonKey(defaultValue: '')
  String description;

  @JsonKey(name: 'igdb_id')
  int igdbId;

  @JsonKey(ignore: true)
  bool completed;

  @JsonKey(name: 'image_url_medium')
  String cover;

  @JsonKey(name: 'platform_id', toJson: cast, fromJson: cast)
  String platform;

  @JsonKey(name: 'mc_score', defaultValue: 0)
  int score;

  @JsonKey(name: 'hltb_main_story', defaultValue: 0)
  double time;

  static cast(value) => value.toString();

  ImportedGame({
    required this.id,
    required this.name,
    this.description = '',
    this.cover = '',
    this.platform = 'PlayStation',
    this.score = 0,
    this.time = 0.0,
    this.igdbId = 0,
    this.completed = false,
  });

  Game asGame() {
    final game = new Game(
      id: this.id,
      name: this.name,
      cover: this.cover,
      description: this.description,
      igdbId: this.igdbId,
      platform: this.platform,
      score: this.score,
      time: this.time
    );
    return game;
  }
  factory ImportedGame.fromJson(Map<String, dynamic> json) => _$ImportedGameFromJson(json);
  Map<String, dynamic> toJson() => _$ImportedGameToJson(this);
}
