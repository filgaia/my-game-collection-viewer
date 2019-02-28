// @vendors
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// @material
import {
    AppBar,
    IconButton,
    Toolbar,
    Tooltip,
    Typography
} from '@material-ui/core';
// https://material.io/tools/icons/?style=baseline
import {
    Games,
    SortByAlpha
} from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
// @components
import ImportDrawer from '../importDrawer/importDrawer';
import FilterDrawer from '../filterDrawer/filterDrawer';
// @styles
import navigatorStyles from './navigatorStyles';

class Navigator extends Component {
    render() {
        const { classes, gamesInformation, setLabelFilter, shortByName, toggleDrawer } = this.props;

        return (
            <AppBar position="static" className={classes.appBar}>
                <Toolbar>
                    <Games className={classes.icon} />
                    <Typography variant="h6" color="inherit" noWrap className={classes.grow}>
                        My Game Collection Viewer
                    </Typography>
                    <IconButton color="inherit" onClick={shortByName}>
                        <Tooltip title="Order list" aria-label="Order list">
                            <SortByAlpha />
                        </Tooltip>
                    </IconButton>
                    <ImportDrawer
                        importDrawer={gamesInformation.get('importDrawer')}
                        toggleDrawer={toggleDrawer}
                    />
                    <FilterDrawer
                        filterDrawer={gamesInformation.get('filterDrawer')}
                        gamesInformation={gamesInformation}
                        setLabelFilter={setLabelFilter}
                        toggleDrawer={toggleDrawer}
                    />
                </Toolbar>
            </AppBar>
        );
    }
}

Navigator.propTypes = {
    classes: PropTypes.object.isRequired,
    gamesInformation: PropTypes.object.isRequired,
    setLabelFilter: PropTypes.func.isRequired,
    shortByName: PropTypes.func.isRequired,
    toggleDrawer: PropTypes.func.isRequired
};

export default withStyles(navigatorStyles)(Navigator);
