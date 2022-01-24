// GENERATED CODE - DO NOT MODIFY BY HAND

part of './catalog.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Catalog _$CatalogFromJson(Map<String, dynamic> json) {
  return Catalog(
    ps: (json['ps'] as List<dynamic>)
        .map((e) => Game.fromJson(e as Map<String, dynamic>))
        .toList(),
    xbox: (json['xbox'] as List<dynamic>)
        .map((e) => Game.fromJson(e as Map<String, dynamic>))
        .toList(),
    ns: (json['ns'] as List<dynamic>)
        .map((e) => Game.fromJson(e as Map<String, dynamic>))
        .toList(),
    wl: (json['wl'] as List<dynamic>)
        .map((e) => Game.fromJson(e as Map<String, dynamic>))
        .toList(),
    dv: json['dv'] as String,
  );
}

Map<String, dynamic> _$CatalogToJson(Catalog instance) => <String, dynamic>{
      'ps': instance.ps.map((e) => e.toJson()).toList(),
      'xbox': instance.xbox.map((e) => e.toJson()).toList(),
      'ns': instance.ns.map((e) => e.toJson()).toList(),
      'wl': instance.wl.map((e) => e.toJson()).toList(),
      'dv': instance.dv,
    };
