// @vendors
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// @material
import { Typography } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
// @styles
import footerStyles from './footerStyles';

export class Footer extends Component {
  render() {
    const { classes } = this.props;

    return (
      <footer className={classes.footer}>
        <Typography variant="h6" align="center" gutterBottom>
          Filgaia developments
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
          Alone in the fields
        </Typography>
      </footer>
    );
  }
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(footerStyles)(Footer);
