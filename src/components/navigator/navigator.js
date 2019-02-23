// @vendors
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// @material
import {
    AppBar,
    IconButton,
    Toolbar,
    Typography
} from '@material-ui/core';
// https://material.io/tools/icons/?style=baseline
import {
    Games,
    SortByAlpha
} from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
// @styles
import navigatorStyles from './navigatorStyles';

class Navigator extends Component {
    render() {
        const { classes, shortByName } = this.props;

        return (
            <AppBar position="static" className={classes.appBar}>
                <Toolbar>
                    <Games className={classes.icon} />
                    <Typography variant="h6" color="inherit" noWrap className={classes.grow}>
                        My Game Collection Viewer
                    </Typography>
                    <IconButton color="inherit" onClick={shortByName}>
                        <SortByAlpha />
                    </IconButton>
                </Toolbar>
            </AppBar>
        );
    }
}

Navigator.propTypes = {
    classes: PropTypes.object.isRequired,
    shortByName: PropTypes.func.isRequired
};

export default withStyles(navigatorStyles)(Navigator);
