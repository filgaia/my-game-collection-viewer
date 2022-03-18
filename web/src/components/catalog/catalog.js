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
  Grid,
  Typography,
} from '@mui/material';
import withStyles from '@mui/styles/withStyles';
// @components
import GameCard from '../gameCard/gameCard';
// @styles
import catalogStyles from './catalogStyles';
// @constants
import { FIRST_PAGE } from '../../constants/index';

class Catalog extends Component {
  static buildError() {
    return (
      <Typography variant="h2" align="center" color="error" gutterBottom>
        There was an error loading your file.
      </Typography>
    );
  }

  buildItems() {
    const { gamesInformation, games, setLabelFilter } = this.props;

    return (
      games.map((card) => (
        <Grid item key={`card-${get(card, 'id')}`} xs={12} sm={6} md={4} lg={3}>
          <LazyLoad height={250}>
            <GameCard
              idGame={get(card, 'id')}
              description={get(card, 'description_short', '')}
              title={get(card, 'name', '')}
              image={get(card, 'image_url_medium', '')}
              plataform={get(card, 'platform_id', 0)}
              labels={get(card, 'labels', [])}
              gamesInformation={gamesInformation}
              setLabelFilter={setLabelFilter}
            />
          </LazyLoad>
        </Grid>
      ))
    );
  }

  buildCatalog(items, loader) {
    const { classes, loadGames, hasMoreItems } = this.props;

    return (
      <main>
        <InfiniteScroll
          pageStart={FIRST_PAGE}
          loadMore={loadGames}
          hasMore={hasMoreItems}
          loader={loader}
        >
          <div className={classNames(classes.layout, classes.cardGrid)}>
            <Grid container spacing={2}>
              {items}
            </Grid>
          </div>
        </InfiniteScroll>
      </main>
    );
  }

  buildLoader() {
    const { classes } = this.props;

    return (
      <div key={0} className={classes.loading}>
        <CircularProgress />
      </div>
    ); // Key to remove warning of infinite scroll
  }

  render() {
    const { gamesInformation } = this.props;
    const loading = gamesInformation.get('loading');
    const error = gamesInformation.get('error');
    let catalogContainer = null;

    const loader = this.buildLoader();
    const items = this.buildItems();
    const errorMessage = Catalog.buildError();

    if (error) {
      catalogContainer = errorMessage;
    } else if (loading) {
      catalogContainer = loader;
    } else {
      catalogContainer = this.buildCatalog(items, loader);
    }

    return (
      <>
        <CssBaseline />
        {catalogContainer}
      </>
    );
  }
}

Catalog.propTypes = {
  classes: PropTypes.object.isRequired,
  gamesInformation: PropTypes.object.isRequired,
  loadGames: PropTypes.func.isRequired,
  hasMoreItems: PropTypes.bool.isRequired,
  games: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  setLabelFilter: PropTypes.func.isRequired,
};

export default withStyles(catalogStyles)(Catalog);
