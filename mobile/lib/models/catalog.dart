import 'package:json_annotation/json_annotation.dart';

import 'game.dart';

part 'catalog.g.dart';

@JsonSerializable(explicitToJson: true)
class Catalog {
  List<Game> ps;
  List<Game> xbox;
  List<Game> ns;
  List<Game> wl;
  String dv;

  Catalog(
      {required this.ps,
      required this.xbox,
      required this.ns,
      required this.wl,
      this.dv = 'ps'});

  factory Catalog.fromJson(Map<String, dynamic> json) =>
      _$CatalogFromJson(json);

  Map<String, dynamic> toJson() => _$CatalogToJson(this);
}
