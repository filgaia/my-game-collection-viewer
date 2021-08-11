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
              Navigator.pop(context);
              Navigator.pushNamed(context, '/ps');
            },
          ),
          ListTile(
            title: const Text('Xbox'),
            onTap: () {
              Navigator.pop(context);
              Navigator.pushNamed(context, '/xbox');
            },
          ),
          ListTile(
            title: const Text('N.Switch'),
            onTap: () {
              Navigator.pop(context);
              Navigator.pushNamed(context, '/ns');
            },
          ),
          ListTile(
            title: const Text('Wishlist'),
            onTap: () {
              Navigator.pop(context);
              Navigator.pushNamed(context, '/wl');
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
