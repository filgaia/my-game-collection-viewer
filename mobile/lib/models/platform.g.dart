// GENERATED CODE - DO NOT MODIFY BY HAND

part of './platform.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Platform _$PlatformFromJson(Map<String, dynamic> json) {
  return Platform(
    id: json['id'] as int,
    name: json['name'] as String,
    abbreviation: json['abbreviation'] as String,
  );
}

Map<String, dynamic> _$PlatformToJson(Platform instance) => <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'abbreviation': instance.abbreviation,
    };