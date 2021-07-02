// @vendors
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { GoogleLogin } from 'react-google-login';
import { GoogleLogout } from 'react-google-login';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// @material
import {
    ListItemIcon,
    Tooltip
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
// @actions
import { actions as loginActions } from '../../actions/login';
// @constants
import { GOOGLE_CLIENT_ID } from '../../data/keys.json';
// @styles
import loginStyles from './loginStyles';

class Login extends Component {
    constructor(props) {
        super(props);

        this.buildLoginIcon = this.buildLoginIcon.bind(this);
        this.buildLogoutIcon = this.buildLogoutIcon.bind(this);
    }

    checkUserAuthenticated = () => {
        return this.props.loginInformation.get('isAuthenticated');
    };

    handleLoginSuccess = response => {
        this.props.loginSuccess({ tokenId: response.tokenId });
    };

    handleLoginFailure = response => {
        this.props.loginFailure({ error: response.error });
    };

    buildIcon(icon, title, onClick) {
        const { classes } = this.props;

        return (
            <ListItemIcon className={classes.listItem} onClick={onClick}>
                <Tooltip title={title} aria-label={title}>
                    <FontAwesomeIcon icon={icon} size="lg" />
                </Tooltip>
            </ListItemIcon>
        );
    }

    buildLoginIcon(renderProps) {
        return this.buildIcon('sign-in-alt', 'Login', renderProps.onClick);
    }

    buildLogoutIcon(renderProps) {
        return this.buildIcon('sign-out-alt', 'Logout', renderProps.onClick);
    }

    render() {
        const { logoutSuccess } = this.props;

        return this.checkUserAuthenticated() ? (
            <GoogleLogout
                clientId={GOOGLE_CLIENT_ID}
                onLogoutSuccess={logoutSuccess}
                render={this.buildLogoutIcon}
            />
        ) :
            (
                <GoogleLogin
                    clientId={GOOGLE_CLIENT_ID}
                    onSuccess={this.handleLoginSuccess}
                    onFailure={this.handleLoginFailure}
                    render={this.buildLoginIcon}
                />
            );
    }
}

Login.propTypes = {
    classes: PropTypes.object.isRequired,
    loginFailure: PropTypes.func.isRequired,
    loginInformation: PropTypes.object.isRequired,
    loginSuccess: PropTypes.func.isRequired,
    logoutSuccess: PropTypes.func.isRequired
};

export default connect(
    state => ({
        loginInformation: state.login
    }),
    {
        loginFailure: loginActions.loginFailure,
        loginSuccess: loginActions.loginSuccess,
        logoutSuccess: loginActions.logoutSuccess
    })(withStyles(loginStyles)(Login));
