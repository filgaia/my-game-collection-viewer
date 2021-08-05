import 'package:json_annotation/json_annotation.dart';

part 'game.g.dart';

@JsonSerializable()
class Game {
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

  Game({
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

  factory Game.fromJson(Map<String, dynamic> json) => _$GameFromJson(json);
}
