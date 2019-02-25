import './login.scss';

//@vendors
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { GoogleLogin } from 'react-google-login';
//@actions
import { actions as loginActions } from '../../actions/login';
// @constants
import { GOOGLE_CLIENT_ID } from '../../data/keys.json';

class Login extends Component {

    checkUserAuthenticated = () => {
        return this.props.loginInformation.get('isAuthenticated');
    };

    handleLoginSuccess = response => {
        this.props.loginSuccess({ tokenId: response.tokenId });
    };

    handleLoginFailure = response => {
        this.props.loginFailure({ error: response.error });
    };

    render() {
        let content = null;
        if (!this.checkUserAuthenticated()) {
            content = (
                <div className="login__login-button">
                    <GoogleLogin
                        clientId={GOOGLE_CLIENT_ID}
                        buttonText="Login"
                        onSuccess={this.handleLoginSuccess}
                        onFailure={this.handleLoginFailure}
                    />
                </div>
            );
        }

        return content;
    }
}

Login.propTypes = {
    loginFailure: PropTypes.func.isRequired,
    loginInformation: PropTypes.object.isRequired,
    loginSuccess: PropTypes.func.isRequired,
};

export default connect(
    state => ({
        loginInformation: state.login
    }),
    {
        loginFailure: loginActions.loginFailure,
        loginSuccess: loginActions.loginSuccess,
    })(Login);
