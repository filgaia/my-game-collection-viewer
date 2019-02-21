import './App.scss';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// @components
// import Header from './../../components/header/header';
import Catalog from './../../components/catalog/catalog';
// @actions
import { loadJson } from '../../actions/gamesInformation';

class App extends Component {
    render() {
        const { gamesInformation, loadJson } = this.props;
        return (
            <div className="app">
                <Catalog
                    gamesInformation={gamesInformation}
                    loadJson={loadJson}
                />
            </div>
        );
    }
}

App.propTypes = {
    gamesInformation: PropTypes.object.isRequired,
    loadJson: PropTypes.func.isRequired
};

export default connect(
    state => ({
        gamesInformation: state.gamesInformation
    }),
    dispatch => ({
        loadJson: (page) => dispatch(loadJson(page))
    }))(App);
