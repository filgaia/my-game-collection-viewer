// @vendors
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import get from 'lodash/get';
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
    render() {
        const { classes } = this.props;
        const games = get(backup, 'Game', []).slice(0, 10);

        return (
            <React.Fragment>
                <CssBaseline />
                <Navigator />
                <main>
                    <Title />
                    <div className={classNames(classes.layout, classes.cardGrid)}>
                        <Grid container spacing={40}>
                            {games.map(card => (
                                <Grid item key={get(card, 'id')} sm={6} md={4} lg={3}>
                                    <GameCard
                                        title={get(card, 'name', '')}
                                        image={get(card, 'image_url_medium', '')}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </div>
                </main>
                <Footer />
            </React.Fragment>
        );
    }
}

Catalog.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(catalogStyles)(Catalog);
