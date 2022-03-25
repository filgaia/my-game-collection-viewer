// @vendors
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// @material
import {
  AppBar,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
// https://material.io/tools/icons/?style=baseline
import {
  Games,
  SortByAlpha,
} from '@mui/icons-material';
import withStyles from '@mui/styles/withStyles';
// @components
import ImportDrawer from '../importDrawer/importDrawer';
import FilterDrawer from '../filterDrawer/filterDrawer';
// @styles
import navigatorStyles from './navigatorStyles';

export class Navigator extends Component {
  render() {
    const {
      classes, importFile, gamesInformation, setLabelFilter, shortByName, toggleDrawer,
    } = this.props;

    return (
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <Games className={classes.icon} />
          <Typography variant="h6" color="inherit" noWrap className={classes.grow}>
            My Game Collection Viewer
          </Typography>
          <IconButton color="inherit" onClick={shortByName} size="large">
            <Tooltip title="Order list" aria-label="Order list">
              <SortByAlpha />
            </Tooltip>
          </IconButton>
          <FilterDrawer
            filterDrawer={gamesInformation.get('filterDrawer')}
            gamesInformation={gamesInformation}
            setLabelFilter={setLabelFilter}
            toggleDrawer={toggleDrawer}
          />
          <ImportDrawer
            importDrawer={gamesInformation.get('importDrawer')}
            importFile={importFile}
            toggleDrawer={toggleDrawer}
          />
        </Toolbar>
      </AppBar>
    );
  }
}

Navigator.propTypes = {
  classes: PropTypes.object.isRequired,
  gamesInformation: PropTypes.object.isRequired,
  importFile: PropTypes.func.isRequired,
  setLabelFilter: PropTypes.func.isRequired,
  shortByName: PropTypes.func.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
};

export default withStyles(navigatorStyles)(Navigator);
