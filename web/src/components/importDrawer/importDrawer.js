// @vendors
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// @material
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  Tooltip,
} from '@mui/material';
// https://material.io/tools/icons/?style=baseline
import {
  CloudDownload,
} from '@mui/icons-material';
import withStyles from '@mui/styles/withStyles';
// @styles
import importDrawerStyles from './importDrawerStyles';
// @constants
import { IMPORT_DRAWER } from '../../constants/index';
// @components
import Login from '../login/login';

export class ImportDrawer extends Component {
  static buildLogoutButton() {
    return <Login />;
  }

  constructor(props) {
    super(props);

    this.onImportFile = this.onImportFile.bind(this);
    this.onToggleDrawer = this.onToggleDrawer.bind(this);
  }

  onImportFile(event) {
    const { importFile } = this.props;
    importFile(get(event, 'target.files.0'));
  }

  onToggleDrawer(open) {
    const { toggleDrawer } = this.props;
    const response = { drawer: IMPORT_DRAWER, open };
    toggleDrawer({ response });
  }

  buildItems() {
    const { classes } = this.props;
    const logoutButton = ImportDrawer.buildLogoutButton();
    const options = [
      { icon: ['fab', 'playstation'], title: 'Coming Soon...' },
      { icon: ['fab', 'xbox'], title: 'Coming Soon...' },
    ];

    const items = options.map((item, index) => (
      <ListItem button key={`ìmport-${index}`}>
        <ListItemIcon className={classes.listItem}>
          <Tooltip title={item.title} aria-label={item.title}>
            <FontAwesomeIcon icon={item.icon} size="lg" />
          </Tooltip>
        </ListItemIcon>
      </ListItem>
    ));

    return (
      <div>
        <List>
          <ListItem button key="import-file">
            <label htmlFor="import-file" className={classes.labelFor}>
              <input accept=".c, application/x-zip-compressed" className={classes.input} id="import-file" type="file" onChange={this.onImportFile} />
              <ListItemIcon className={classes.listItem}>
                <Tooltip title="From file" aria-label="From file">
                  <FontAwesomeIcon icon="file-import" size="lg" />
                </Tooltip>
              </ListItemIcon>
            </label>
          </ListItem>
          <ListItem button key="import-drive">
            {logoutButton}
          </ListItem>
          {items}
        </List>
      </div>
    );
  }

  render() {
    const { importDrawer } = this.props;
    const items = this.buildItems();

    return (
      <>
        <IconButton color="inherit" onClick={() => this.onToggleDrawer(true)} size="large">
          <Tooltip title="Add Games..." aria-label="Add Games...">
            <CloudDownload />
          </Tooltip>
        </IconButton>
        <Drawer anchor="right" open={importDrawer} onClose={() => this.onToggleDrawer(false)}>
          {items}
        </Drawer>
      </>
    );
  }
}

ImportDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  importDrawer: PropTypes.bool.isRequired,
  importFile: PropTypes.func.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
};

export default withStyles(importDrawerStyles)(ImportDrawer);
