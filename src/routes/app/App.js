import './App.scss';
//@vendors
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// @components
import Catalog from '../../components/catalog/catalog';
import Navigator from '../../components/navigator/navigator';
import Footer from '../../components/footer/footer';
// @actions
import { initGames, loadGames, shortByName } from '../../actions/gamesInformation';
import {actions as loginActions}  from '../../actions/login';

class App extends Component {

    checkUserAuthenticated = () => {
        return this.props.loginInformation.get('isAuthenticated');
    };

    buildCatalog() {
        const { gamesInformation, loadGames, login, initGames } = this.props;
        let catalog = login;

        if (this.checkUserAuthenticated()) {
            catalog = (
                <Catalog
                    gamesInformation={gamesInformation}
                    initGames={initGames}
                    loadGames={loadGames}
                />
            );
        }

        return catalog;
    }

    render() {
        const { shortByName, loginInformation, logoutSuccess } = this.props;
        const catalog = this.buildCatalog();
        return (
            <div className="app">
                <Navigator
                    loginInformation={loginInformation}
                    logoutSuccess={logoutSuccess}
                    shortByName={shortByName} />
                {catalog}
                <Footer />
            </div>
        );
    }
}

App.propTypes = {
    gamesInformation: PropTypes.object.isRequired,
    initGames: PropTypes.func.isRequired,
    loadGames: PropTypes.func.isRequired,
    login: PropTypes.any.isRequired,
    logoutSuccess: PropTypes.func.isRequired,
    loginInformation: PropTypes.object.isRequired,
    shortByName: PropTypes.func.isRequired
};

export default connect(
    state => ({
        gamesInformation: state.gamesInformation,
        loginInformation: state.login,
    }),
    {
        initGames: initGames,
        loadGames: loadGames,
        logoutSuccess: loginActions.logoutSuccess,
        shortByName: shortByName
    })(App);
