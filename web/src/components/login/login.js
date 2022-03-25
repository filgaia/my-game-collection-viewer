// @vendors
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// @material
import {
  ListItemIcon,
  Tooltip,
} from '@mui/material';
import withStyles from '@mui/styles/withStyles';
// @actions
import loginActions from '../../actions/login';
// @constants
import keys from '../../data/keys.json';
// @styles
import loginStyles from './loginStyles';

export class Login extends Component {
  constructor(props) {
    super(props);

    this.buildLoginIcon = this.buildLoginIcon.bind(this);
    this.buildLogoutIcon = this.buildLogoutIcon.bind(this);
  }

  checkUserAuthenticated = () => {
    const { loginInformation } = this.props;
    loginInformation.get('isAuthenticated');
  };

  handleLoginSuccess = (response) => {
    const { loginSuccess } = this.props;
    loginSuccess({ tokenId: response.tokenId });
  };

  handleLoginFailure = (response) => {
    const { loginFailure } = this.props;
    loginFailure({ error: response.error });
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
        clientId={keys.GOOGLE_CLIENT_ID}
        onLogoutSuccess={logoutSuccess}
        render={this.buildLogoutIcon}
      />
    )
      : (
        <GoogleLogin
          clientId={keys.GOOGLE_CLIENT_ID}
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
  logoutSuccess: PropTypes.func.isRequired,
};

export default connect(
  (state) => ({
    loginInformation: state.login,
  }),
  {
    loginFailure: loginActions.actions.loginFailure,
    loginSuccess: loginActions.actions.loginSuccess,
    logoutSuccess: loginActions.actions.logoutSuccess,
  },
)(withStyles(loginStyles)(Login));
