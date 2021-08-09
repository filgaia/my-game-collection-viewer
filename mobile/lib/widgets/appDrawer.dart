import 'package:Gameshelf/models/screenArguments.dart';
import 'package:flutter/material.dart';

class AppDrawer {
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
            child: Text('Gameshelf'),
          ),
          ListTile(
            title: const Text('PlayStation'),
            onTap: () {
              // Update the state of the app.
              Navigator.pop(context);
              Navigator.pushNamed(context, '/ps', arguments: ScreenArguments(
                'PS Games',
                'ps',
                Colors.blueAccent
              ));
            },
          ),
          ListTile(
            title: const Text('Xbox'),
            onTap: () {
              // Update the state of the app.
              Navigator.pop(context);
              Navigator.pushNamed(context, '/xbox', arguments: ScreenArguments(
                  'Xbox Games',
                  'xbox',
                  Colors.green
              ));
            },
          ),
          ListTile(
            title: const Text('N.Switch'),
            onTap: () {
              // Update the state of the app.
              Navigator.pop(context);
              Navigator.pushNamed(context, '/ns', arguments: ScreenArguments(
                  'N.Switch Games',
                  'ns',
                  Colors.red
              ));
            },
          ),
          ListTile(
            title: const Text('Wishlist'),
            onTap: () {
              // Update the state of the app.
              Navigator.pop(context);
              Navigator.pushNamed(context, '/wl', arguments: ScreenArguments(
                  'Wishlist',
                  'wl',
                  Colors.cyan
              ));
            },
          ),
          ListTile(
            title: const Text('Settings'),
            onTap: () {
              // Update the state of the app.
              Navigator.pop(context);
              Navigator.pushNamed(context, '/settings');
            },
          ),
        ],
      ),
    );
  }
}
