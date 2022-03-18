// @vendors
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// @material
import { Typography } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
// @styles
import titleStyles from './titleStyles';

class Title extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.heroUnit}>
        <div className={classes.heroContent}>
          <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
            My Game Collection Viewer
          </Typography>
          <Typography variant="h6" align="center" color="textSecondary" paragraph>
            Viewer for the great app My Game Collection!
          </Typography>
        </div>
      </div>
    );
  }
}

Title.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(titleStyles)(Title);
