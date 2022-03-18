// @vendors
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// @material
import { Typography } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
// @styles
import tabContainerStyles from './tabContainerStyles';

class TabContainer extends Component {
  render() {
    const { classes, children, dir } = this.props;

    return (
      <Typography component="div" dir={dir} className={classes.tab}>
        {children}
      </Typography>
    );
  }
}

TabContainer.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node,
  dir: PropTypes.string.isRequired,
};

TabContainer.defaultProps = {
  children: null,
};

export default withStyles(tabContainerStyles)(TabContainer);
