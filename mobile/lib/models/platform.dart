import 'package:json_annotation/json_annotation.dart';

part './platform.g.dart';

@JsonSerializable()
class Platform {
  int id;
  String name;
  String abbreviation;

  Platform({required this.id, required this.name, required this.abbreviation});

  factory Platform.fromJson(Map<String, dynamic> json) => _$PlatformFromJson(json);
  Map<String, dynamic> toJson() => _$PlatformToJson(this);
}
