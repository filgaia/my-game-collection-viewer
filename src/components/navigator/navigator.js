// @vendors
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// @material
import {
    AppBar,
    Toolbar,
    Typography
} from '@material-ui/core';
// https://material.io/tools/icons/?style=baseline
import Games from '@material-ui/icons/Games';
import { withStyles } from '@material-ui/core/styles';
// @styles
import navigatorStyles from './navigatorStyles';

class Navigator extends Component {
    render() {
        const { classes } = this.props;

        return (
            <AppBar position="static" className={classes.appBar}>
                <Toolbar>
                    <Games className={classes.icon} />
                    <Typography variant="h6" color="inherit" noWrap>
                        My Game Collection Viewer
                    </Typography>
                </Toolbar>
            </AppBar>
        );
    }
}

Navigator.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(navigatorStyles)(Navigator);
