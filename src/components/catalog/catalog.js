// @vendors
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import get from 'lodash/get';
import LazyLoad from 'react-lazyload';
import InfiniteScroll from 'react-infinite-scroller';
// @material
import {
    CssBaseline,
    Grid
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
// @components
import Navigator from './../navigator/navigator';
import Title from './../title/title';
import GameCard from './../gameCard/gameCard';
import Footer from './../footer/footer';
// @constants
import { backup } from './../../data/db.json';
// @styles
import catalogStyles from './catalogStyles';

class Catalog extends Component {
    constructor(props) {
        super(props);

        this.state = {
            games: get(backup, 'Game', []).slice(0, 20),
            hasMoreItems: true
        };

        this.loadItems = this.loadItems.bind(this);
    }

    loadItems(page) {
        const load = 20;
        const start = page * load;
        const items = get(backup, 'Game', []);
        const games = items.slice(0, start + load);
        const hasMoreItems = items.length >= start;

        this.setState({ games, hasMoreItems });
    }

    render() {
        const { classes } = this.props;
        const { games, hasMoreItems } = this.state;

        const loader = <div className="loader">Loading ...</div>;

        const items = games.map(card => (
            <Grid item key={get(card, 'id')} sm={6} md={4} lg={3}>
                <LazyLoad height={250}>
                    <GameCard
                        title={get(card, 'name', '')}
                        image={get(card, 'image_url_medium', '')}
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
                        loadMore={this.loadItems}
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
};

export default withStyles(catalogStyles)(Catalog);
