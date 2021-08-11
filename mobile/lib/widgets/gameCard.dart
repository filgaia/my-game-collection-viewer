import 'package:Gameshelf/models/game.dart';
import 'package:flutter/material.dart';

class GameCard extends StatelessWidget {
  GameCard(this.game);

  final Game game;

  @override
  Widget build(BuildContext context) {
    return _buildItem(this.game);
  }

  Widget _buildItem(Game game) {
    return Card(
        color: _getBGColor(game.platform),
        clipBehavior: Clip.antiAlias,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10.0),
        ),
        child: Column(children: <Widget>[
          Container(
            padding: const EdgeInsets.all(8.0),
            child: Align(
              alignment: Alignment.centerLeft,
              child: Text(
                game.platform,
                textAlign: TextAlign.left,
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
            ),
          ),
          Expanded(
            child: Image.network(game.cover,
                fit: BoxFit.fill, loadingBuilder: _imageLoading),
          ),
        ]));
  }

  Widget _imageLoading(
      BuildContext context, Widget child, ImageChunkEvent? loadingProgress) {
    if (loadingProgress == null) return child;
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.all(15),
      child: Align(
        alignment: Alignment.topCenter,
        heightFactor: 5,
        widthFactor: 5,
        child: CircularProgressIndicator(
          value: loadingProgress.expectedTotalBytes != null
              ? loadingProgress.cumulativeBytesLoaded /
                  loadingProgress.expectedTotalBytes!
              : null,
        ),
      ),
    );
  }

  Color _getBGColor(String platform) {
    switch (platform) {
      case 'Xbox':
      case 'Xbox 360':
      case 'Xbox One':
        return Colors.green;
      case 'Nintendo Switch':
        return Colors.red;
      default:
        return Colors.blueAccent;
    }
  }
}
