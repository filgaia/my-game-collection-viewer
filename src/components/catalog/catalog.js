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

    render() {
        const { classes, gamesInformation, loadJson } = this.props;

        const games = gamesInformation.get('games');
        const hasMoreItems = gamesInformation.get('hasMoreItems');

        const loader = <CircularProgress key={0} />; // Key to remove warning of infinite scroll

        const items = games.map(card => (
            <Grid item key={get(card, 'id')} sm={6} md={4} lg={3}>
                <LazyLoad height={250}>
                    <GameCard
                        title={get(card, 'name', '')}
                        image={get(card, 'image_url_medium', '')}
                        plataform={get(card, 'platform_id', 0)}
                    />
                </LazyLoad>
            </Grid>
        ));

        return (
            <React.Fragment>
                <CssBaseline />
                <Navigator />
                <main>
                    <Title />
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={loadJson}
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
                <Footer />
            </React.Fragment >
        );
    }
}

Catalog.propTypes = {
    classes: PropTypes.object.isRequired,
    gamesInformation: PropTypes.object.isRequired,
    loadJson: PropTypes.func.isRequired
};

export default withStyles(catalogStyles)(Catalog);
