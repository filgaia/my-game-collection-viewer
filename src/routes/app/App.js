import './App.scss';
//@vendors
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// @components
import SwipeableView from '../../components/tabContainer/swipeableView';
import Footer from '../../components/footer/footer';
import Navigator from '../../components/navigator/navigator';
// @actions
import { initGames, loadGames, shortByName } from '../../actions/gamesInformation';
import { actions as loginActions } from '../../actions/login';

class App extends Component {

    checkUserAuthenticated = () => {
        return this.props.loginInformation.get('isAuthenticated');
    };

    buildCatalog() {
        const { gamesInformation, loadGames, initGames } = this.props;

        return (
            <React.Fragment>
                <SwipeableView
                    gamesInformation={gamesInformation}
                    initGames={initGames}
                    loadGames={loadGames}
                />
            </React.Fragment>
        );
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
