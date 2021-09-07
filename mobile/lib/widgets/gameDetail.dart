import 'package:GameShelf/models/game.dart';
import 'package:flutter/material.dart';
import 'package:GameShelf/utils/util.dart';

class GameDetail extends StatelessWidget {
  const GameDetail({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final args = ModalRoute.of(context)!.settings.arguments as Game;

    return Scaffold(
      appBar: AppBar(
        title: Text(args.name),
        backgroundColor: getBGColor(args.platform),
      ),
      body: Container(
        decoration: BoxDecoration(
            image: DecorationImage(
                alignment: Alignment.topCenter,
                fit: BoxFit.cover,
                colorFilter: new ColorFilter.mode(Colors.black.withOpacity(0.3), BlendMode.dstATop),
                image: NetworkImage(args.cover)),
        ),
        child: null /* add child content here */,
      ),
    );
  }
}
