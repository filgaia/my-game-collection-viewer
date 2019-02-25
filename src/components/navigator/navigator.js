// @vendors
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { GoogleLogout } from 'react-google-login';
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
// @constants
import { GOOGLE_CLIENT_ID } from '../../config/index.json';

class Navigator extends Component {

    onLogoutSuccess = () => {
        this.props.logoutSuccess();
    }

    buildLogoutButton() {
        let logoutButton = null;
        if (this.props.loginInformation.get('isAuthenticated')) {
            logoutButton = (
                <GoogleLogout
                    clientId={GOOGLE_CLIENT_ID}
                    buttonText="Logout"
                    onLogoutSuccess={this.onLogoutSuccess}
                >
                </GoogleLogout>
            );
        }

        return logoutButton;
    }

    render() {
        const { classes, shortByName } = this.props;
        const logoutButton = this.buildLogoutButton();

        return (
            <AppBar position="static" className={classes.appBar}>
                <Toolbar>
                    <Games className={classes.icon} />
                    <Typography variant="h6" color="inherit" noWrap className={classes.grow}>
                        My Game Collection Viewer
                    </Typography>
                    {logoutButton}
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
    loginInformation: PropTypes.object.isRequired,
    logoutSuccess: PropTypes.func.isRequired,
    shortByName: PropTypes.func.isRequired
};

export default withStyles(navigatorStyles)(Navigator);
