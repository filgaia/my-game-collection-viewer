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
import Catalog from '../../components/catalog/catalog';
// @constants
import { CATALOG_TAB, WISHLIST_TAB } from '../../constants/index';

class SwipeableView extends Component {

    constructor(props) {
        super(props);

        this.buildCatalogTab = this.buildCatalogTab.bind(this);
        this.buildWishListTab = this.buildWishListTab.bind(this);

        this.state = { value: CATALOG_TAB };
    }

    componentDidMount() {
        this.props.initGames();
    }

    handleChange = (event, value) => {
        this.setState({ value });
    };

    handleChangeIndex = index => {
        this.setState({ value: index });
    };


    buildCatalogTab() {
        const { gamesInformation, loadGames } = this.props;
        return this.state.value === CATALOG_TAB ?
            (
                <Catalog
                    gamesInformation={gamesInformation}
                    loadGames={(page) => {
                        const params = {
                            page,
                            source: gamesInformation.get('source'),
                            propGames: 'games',
                            propMoreItems: 'hasMoreItems'
                        };
                        loadGames(params);
                    }}
                    hasMoreItems={gamesInformation.get('hasMoreItems')}
                    games={gamesInformation.get('games')}
                />
            )
            :
            null;
    }

    buildWishListTab() {
        const { gamesInformation, loadGames } = this.props;
        return this.state.value === WISHLIST_TAB ?
            (
                <Catalog
                    gamesInformation={gamesInformation}
                    loadGames={(page) => {
                        const params = {
                            page,
                            source: gamesInformation.get('sourceWishList'),
                            propGames: 'wishList',
                            propMoreItems: 'hasMoreItemsWishList'
                        };
                        loadGames(params);
                    }}
                    hasMoreItems={gamesInformation.get('hasMoreItemsWishList')}
                    games={gamesInformation.get('wishList')}
                />
            )
            :
            null;
    }


    render() {

        const { classes, theme } = this.props;
        const catalog = this.buildCatalogTab();
        const wishList = this.buildWishListTab();
        const axis = theme.direction === 'rtl' ? 'x-reverse' : 'x';

        return (
            <div className={classes.root}>
                <AppBar position="static" color="default">
                    <Tabs
                        value={this.state.value}
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
                    index={this.state.value}
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
    theme: PropTypes.object.isRequired
};

export default withStyles(swipeableViewStyles, { withTheme: true })(SwipeableView);
