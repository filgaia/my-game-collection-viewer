import 'package:json_annotation/json_annotation.dart';

import './iGame.dart';
part './game.g.dart';

@JsonSerializable()
class Game implements IGame {
  int id;
  String name;
  String description;
  int igdbId;
  bool completed;
  String cover;
  String platform;
  int score;
  double time;

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
  Map<String, dynamic> toJson() => _$GameToJson(this);
}
