// GENERATED CODE - DO NOT MODIFY BY HAND

part of './importedGame.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ImportedGame _$ImportedGameFromJson(Map<String, dynamic> json) {
  return ImportedGame(
    id: json['id'] as int,
    name: json['name'] as String,
    description: json['description'] as String? ?? '',
    cover: json['image_url_medium'] as String,
    platform: ImportedGame.cast(json['platform_id']),
    score: json['mc_score'] as int? ?? 0,
    time: (json['hltb_main_story'] as num?)?.toDouble() ?? 0,
    igdbId: json['igdb_id'] as int,
  );
}

Map<String, dynamic> _$ImportedGameToJson(ImportedGame instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'description': instance.description,
      'igdb_id': instance.igdbId,
      'image_url_medium': instance.cover,
      'platform_id': ImportedGame.cast(instance.platform),
      'mc_score': instance.score,
      'hltb_main_story': instance.time,
    };
