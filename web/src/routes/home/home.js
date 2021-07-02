//@vendors
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// @font awesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { faSignInAlt, faSignOutAlt, faFileImport } from '@fortawesome/free-solid-svg-icons';
// @components
import SwipeableView from '../../components/tabContainer/swipeableView';
import Footer from '../../components/footer/footer';
import Navigator from '../../components/navigator/navigator';
// @actions
import { importFile, initGames, loadGames, setLabelFilter, shortByName, actions as gamesActions } from '../../actions/gamesInformation';

class Home extends Component {
    componentDidMount() {
        library.add(fab, faSignInAlt, faSignOutAlt, faFileImport);
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
        const { gamesInformation, importFile, setLabelFilter, shortByName, toggleDrawer } = this.props;

        const catalog = this.buildCatalog();
        return (
            <React.Fragment>
                <Navigator
                    gamesInformation={gamesInformation}
                    importFile={importFile}
                    setLabelFilter={setLabelFilter}
                    shortByName={shortByName}
                    toggleDrawer={toggleDrawer}
                />
                {catalog}
                <Footer />
            </React.Fragment>
        );
    }
}

Home.propTypes = {
    gamesInformation: PropTypes.object.isRequired,
    importFile: PropTypes.func.isRequired,
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
        importFile: importFile,
        initGames: initGames,
        loadGames: loadGames,
        setLabelFilter: setLabelFilter,
        setTab: gamesActions.setTab,
        shortByName: shortByName,
        toggleDrawer: gamesActions.toggleDrawer
    })(Home);
