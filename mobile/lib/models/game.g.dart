// GENERATED CODE - DO NOT MODIFY BY HAND

part of './game.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Game _$GameFromJson(Map<String, dynamic> json) {
  return Game(
    id: json['id'] as int,
    name: json['name'] as String,
    description: json['description'] as String,
    cover: json['cover'] as String,
    platform: json['platform'] as String,
    score: json['score'] as int,
    time: (json['time'] as num).toDouble(),
    igdbId: json['igdbId'] as int,
    completed: json['completed'] as bool,
  );
}

Map<String, dynamic> _$GameToJson(Game instance) => <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'description': instance.description,
      'igdbId': instance.igdbId,
      'completed': instance.completed,
      'cover': instance.cover,
      'platform': instance.platform,
      'score': instance.score,
      'time': instance.time,
    };
