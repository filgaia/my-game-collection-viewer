import 'package:flutter/material.dart';

class ScreenArguments {
  late String title;
  late Color color;

  ScreenArguments(this.title, this.color);

  ScreenArguments.byRoute(String? route) {
    switch(route) {
      case '/xbox':
        this.title = 'Xbox Games';
        this.color = Colors.green;
        break;
      case '/ns':
        this.title = 'N.Switch Games';
        this.color = Colors.red;
        break;
      case '/wl':
        this.title = 'Wishlist';
        this.color = Colors.blueGrey;
        break;
      default:
        this.title = 'PS Games';
        this.color = Colors.blueAccent;
        break;
    }
  }
}
