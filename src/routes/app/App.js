import './App.scss';
//@vendors
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// @ffont awesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSignInAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
// @components
import SwipeableView from '../../components/tabContainer/swipeableView';
import Footer from '../../components/footer/footer';
import Navigator from '../../components/navigator/navigator';
// @actions
import { initGames, loadGames, setLabelFilter, shortByName, actions as gamesActions } from '../../actions/gamesInformation';

class App extends Component {
    componentDidMount() {
        library.add(faSignInAlt, faSignOutAlt);
    }

    buildCatalog() {
        const { gamesInformation, loadGames, initGames, setLabelFilter, setTab } = this.props;

        return (
            <React.Fragment>
                <SwipeableView
                    gamesInformation={gamesInformation}
                    initGames={initGames}
                    loadGames={loadGames}
                    setLabelFilter={setLabelFilter}
                    setTab={setTab}
                />
            </React.Fragment>
        );
    }

    render() {
        const { gamesInformation, shortByName, toggleDrawer } = this.props;
        const catalog = this.buildCatalog();
        return (
            <div className="app">
                <Navigator
                    gamesInformation={gamesInformation}
                    shortByName={shortByName}
                    toggleDrawer={toggleDrawer}
                />
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
    setLabelFilter: PropTypes.func.isRequired,
    setTab: PropTypes.func.isRequired,
    shortByName: PropTypes.func.isRequired,
    toggleDrawer: PropTypes.func.isRequired
};

export default connect(
    state => ({
        gamesInformation: state.gamesInformation
    }),
    {
        initGames: initGames,
        loadGames: loadGames,
        setLabelFilter: setLabelFilter,
        setTab: gamesActions.setTab,
        shortByName: shortByName,
        toggleDrawer: gamesActions.toggleDrawer
    })(App);
