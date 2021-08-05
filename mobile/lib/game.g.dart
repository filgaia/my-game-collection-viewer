// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'game.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Game _$GameFromJson(Map<String, dynamic> json) {
  return Game(
    id: json['id'] as int,
    name: json['name'] as String,
    description: json['description'] as String? ?? '',
    cover: json['image_url_medium'] as String,
    platform: Game.cast(json['platform_id']),
    score: json['mc_score'] as int? ?? 0,
    time: (json['hltb_main_story'] as num?)?.toDouble() ?? 0,
    igdbId: json['igdb_id'] as int,
  );
}

Map<String, dynamic> _$GameToJson(Game instance) => <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'description': instance.description,
      'igdb_id': instance.igdbId,
      'image_url_medium': instance.cover,
      'platform_id': Game.cast(instance.platform),
      'mc_score': instance.score,
      'hltb_main_story': instance.time,
    };
