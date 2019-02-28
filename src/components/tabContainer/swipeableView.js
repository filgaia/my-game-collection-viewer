// @vendors
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
// @material
import {
    AppBar,
    Tabs,
    Tab,
    withStyles
} from '@material-ui/core';
import {
    Favorite,
    LibraryBooks
} from '@material-ui/icons';
// @styles
import swipeableViewStyles from './swipeableViewStyles';
// @componets
import TabContainer from './tabContainer';
import Catalog from '../catalog/catalog';
// @constants
import { CATALOG_TAB, WISHLIST_TAB } from '../../constants/index';

class SwipeableView extends Component {

    componentDidMount() {
        this.props.initGames();
    }

    handleChange = (event, tab) => {
        this.props.setTab({ tab });
    };

    handleChangeIndex = tab => {
        this.props.setTab({ tab });
    };


    buildCatalogTab() {
        const { gamesInformation, loadGames, setLabelFilter } = this.props;
        const tab = gamesInformation.get('tab');
        const source = gamesInformation.get('idLabelFilter') ? 'sourceFiltered' : 'source';
        const params = {
            source: gamesInformation.get(source),
            propGames: 'games',
            propMoreItems: 'hasMoreItems'
        };

        return tab === CATALOG_TAB ? (
            <Catalog
                gamesInformation={gamesInformation}
                loadGames={(page) => {
                    loadGames(page, params);
                }}
                hasMoreItems={gamesInformation.get('hasMoreItems')}
                games={gamesInformation.get('games')}
                setLabelFilter={setLabelFilter}
            />
        ) : null;
    }

    buildWishListTab() {
        const { gamesInformation, loadGames, setLabelFilter } = this.props;
        const tab = gamesInformation.get('tab');
        const params = {
            source: gamesInformation.get('sourceWishList'),
            propGames: 'wishList',
            propMoreItems: 'hasMoreItemsWishList'
        };

        return tab === WISHLIST_TAB ? (
            <Catalog
                gamesInformation={gamesInformation}
                loadGames={(page) => loadGames(page, params)}
                hasMoreItems={gamesInformation.get('hasMoreItemsWishList')}
                games={gamesInformation.get('wishList')}
                setLabelFilter={setLabelFilter}
            />
        ) : null;
    }


    render() {

        const { classes, theme, gamesInformation } = this.props;

        const tab = gamesInformation.get('tab');
        const catalog = this.buildCatalogTab();
        const wishList = this.buildWishListTab();
        const axis = theme.direction === 'rtl' ? 'x-reverse' : 'x';

        return (
            <div className={classes.root}>
                <AppBar position="static" color="default">
                    <Tabs
                        value={tab}
                        onChange={this.handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                    >
                        <Tab label="Catalog" icon={<LibraryBooks />} />
                        <Tab label="WishList" icon={<Favorite />} />
                    </Tabs>
                </AppBar>
                <SwipeableViews
                    axis={axis}
                    index={tab}
                    onChangeIndex={this.handleChangeIndex}
                >
                    <TabContainer dir={theme.direction}>
                        {catalog}
                    </TabContainer>
                    <TabContainer dir={theme.direction}>
                        {wishList}
                    </TabContainer>
                </SwipeableViews>
            </div >
        );
    }
}

SwipeableView.propTypes = {
    classes: PropTypes.object.isRequired,
    gamesInformation: PropTypes.object.isRequired,
    initGames: PropTypes.func.isRequired,
    loadGames: PropTypes.func.isRequired,
    setLabelFilter: PropTypes.func.isRequired,
    setTab: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired
};

export default withStyles(swipeableViewStyles, { withTheme: true })(SwipeableView);
