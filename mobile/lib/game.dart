class Game {
  int id;
  String name;

  Game({ required this.id, required this.name });

  factory Game.fromJson(Map<String, dynamic> parsedJson){
    return Game(
        id: parsedJson['id'],
        name : parsedJson['name'],
    );
  }
}
