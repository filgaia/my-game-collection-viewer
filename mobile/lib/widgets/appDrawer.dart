import 'package:flutter/material.dart';

class AppDrawer {
  static Widget listItem(context, title, uri) {
    return ListTile(
      title: Text(title),
      onTap: () {
        Navigator.pop(context);
        Navigator.pushNamed(context, uri);
      },
    );
  }

  static Widget mainDrawer(BuildContext context) {
    return Drawer(
      // Add a ListView to the drawer. This ensures the user can scroll
      // through the options in the drawer if there isn't enough vertical
      // space to fit everything.
      child: ListView(
        // Important: Remove any padding from the ListView.
        padding: EdgeInsets.zero,
        children: [
          const DrawerHeader(
            decoration: BoxDecoration(
              color: Colors.indigoAccent,
            ),
            child: Text('GameShelf'),
          ),
          listItem(context, 'PlayStation', '/ps'),
          listItem(context, 'Xbox', '/xbox'),
          listItem(context, 'N.Switch', '/ns'),
          listItem(context, 'Wishlist', '/wl'),
          listItem(context, 'Settings', '/settings'),
        ],
      ),
    );
  }
}
