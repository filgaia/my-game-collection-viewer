import './App.scss';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// @components
// import Header from './../../components/header/header';
import Catalog from './../../components/catalog/catalog';
// @actions
import { initGames, loadGames, shortByName } from '../../actions/gamesInformation';

class App extends Component {
    render() {
        const { gamesInformation, loadGames, shortByName, initGames } = this.props;
        return (
            <div className="app">
                <Catalog
                    gamesInformation={gamesInformation}
                    initGames={initGames}
                    loadGames={loadGames}
                    shortByName={shortByName}
                />
            </div>
        );
    }
}

App.propTypes = {
    gamesInformation: PropTypes.object.isRequired,
    initGames: PropTypes.func.isRequired,
    loadGames: PropTypes.func.isRequired,
    shortByName: PropTypes.func.isRequired
};

export default connect(
    state => ({
        gamesInformation: state.gamesInformation
    }),
    {
        initGames: initGames,
        loadGames: loadGames,
        shortByName: shortByName
    })(App);
