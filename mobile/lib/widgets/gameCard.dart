import 'package:GameShelf/models/game.dart';
import 'package:GameShelf/utils/util.dart';
import 'package:flutter/material.dart';

class GameCard extends StatelessWidget {
  final Game game;

  GameCard(this.game);

  @override
  Widget build(BuildContext context) {
    return _buildItem(context, this.game);
  }

  Widget _buildItem(BuildContext context, Game game) {
    return GestureDetector(
        onTap: () => Navigator.pushNamed(context, '/detail', arguments: game),
        child: Card(
            color: getBGColor(game.platform),
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
            ])));
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
}
