// @vendors
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import get from 'lodash/get';
import LazyLoad from 'react-lazyload';
import InfiniteScroll from 'react-infinite-scroller';
// @material
import {
    CircularProgress,
    CssBaseline,
    Grid
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
// @components
import Navigator from './../navigator/navigator';
import Title from './../title/title';
import GameCard from './../gameCard/gameCard';
import Footer from './../footer/footer';

// @styles
import catalogStyles from './catalogStyles';

class Catalog extends Component {
    componentDidMount() {
        this.props.initGames();
    }

    buildItems() {
        const { gamesInformation } = this.props;
        const games = gamesInformation.get('games');

        return (
            games.map(card => (
                <Grid item key={get(card, 'id')} xs={12} sm={6} md={4} lg={3}>
                    <LazyLoad height={250}>
                        <GameCard
                            description={get(card, 'description_short', '')}
                            title={get(card, 'name', '')}
                            image={get(card, 'image_url_medium', '')}
                            plataform={get(card, 'platform_id', 0)}
                        />
                    </LazyLoad>
                </Grid>
            ))
        );
    }

    buildCatalog(items, loader) {
        const { classes, gamesInformation, loadGames } = this.props;
        const hasMoreItems = gamesInformation.get('hasMoreItems');

        return (
            <main>
                <Title />
                <InfiniteScroll
                    pageStart={0}
                    loadMore={loadGames}
                    hasMore={hasMoreItems}
                    loader={loader}
                >
                    <div className={classNames(classes.layout, classes.cardGrid)}>
                        <Grid container spacing={40}>
                            {items}
                        </Grid>
                    </div>
                </InfiniteScroll>
            </main>
        );
    }

    render() {
        const { gamesInformation, shortByName } = this.props;

        const loading = gamesInformation.get('loading');

        const loader = <CircularProgress key={0} />; // Key to remove warning of infinite scroll

        const items = this.buildItems();

        const catalogContainer = loading ? loader : this.buildCatalog(items, loader);

        return (
            <React.Fragment>
                <CssBaseline />
                <Navigator shortByName={shortByName} />
                {catalogContainer}
                <Footer />
            </React.Fragment >
        );
    }
}

Catalog.propTypes = {
    classes: PropTypes.object.isRequired,
    gamesInformation: PropTypes.object.isRequired,
    initGames: PropTypes.func.isRequired,
    loadGames: PropTypes.func.isRequired,
    shortByName: PropTypes.func.isRequired
};

export default withStyles(catalogStyles)(Catalog);
