import 'package:flutter/material.dart';

Color getBGColor(String platform) {
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
