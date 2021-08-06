abstract class IGame {
  int id;
  String name;
  String description;
  int igdbId;
  bool completed;
  String cover;
  String platform;
  int score;
  double time;

  IGame({
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

  Map<String, dynamic> toJson();
}
