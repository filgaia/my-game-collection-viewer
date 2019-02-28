// @vendors
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// @material
import {
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    Tooltip
} from '@material-ui/core';
// https://material.io/tools/icons/?style=baseline
import {
    FilterList
} from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
// @componets
import LabelTag from '../labelTag/labelTag';
// @styles
import filterDrawerStyles from './filterDrawerStyles';
// @constants
import { FILTER_DRAWER } from '../../constants/index';

class FilterDrawer extends Component {
    constructor(props) {
        super(props);

        this.onToggleDrawer = this.onToggleDrawer.bind(this);
    }

    onToggleDrawer(open) {
        const response = { drawer: FILTER_DRAWER, open };
        this.props.toggleDrawer({ response });
    }

    buildItems() {
        const { classes, gamesInformation, setLabelFilter } = this.props;
        const labelsTagsItems = gamesInformation.get('labels');

        const items = labelsTagsItems.map((item, index) => (
            <ListItem button key={`filter-${index}`}>
                <ListItemIcon className={classes.listItem}>
                    <Tooltip title={item.name} aria-label={item.name}>
                        <LabelTag
                            key={item.id}
                            label={item}
                            gamesInformation={gamesInformation}
                            setLabelFilter={setLabelFilter}
                        />
                    </Tooltip>
                </ListItemIcon>
            </ListItem>
        ));

        return (
            <List>
                {items}
            </List>
        );
    }

    render() {
        const { filterDrawer } = this.props;
        const items = this.buildItems();

        return (
            <React.Fragment>
                <IconButton color="inherit" onClick={() => this.onToggleDrawer(true)}>
                    <Tooltip title="Filter..." aria-label="Filter...">
                        <FilterList />
                    </Tooltip>
                </IconButton>
                <Drawer anchor="right" open={filterDrawer} onClose={() => this.onToggleDrawer(false)}>
                    <div
                        tabIndex={0}
                        role="button"
                        onClick={() => this.onToggleDrawer(false)}
                        onKeyDown={() => this.onToggleDrawer(false)}
                    >
                        {items}
                    </div>
                </Drawer>
            </React.Fragment>
        );
    }
}

FilterDrawer.propTypes = {
    classes: PropTypes.object.isRequired,
    filterDrawer: PropTypes.bool.isRequired,
    gamesInformation: PropTypes.object.isRequired,
    setLabelFilter: PropTypes.func.isRequired,
    toggleDrawer: PropTypes.func.isRequired
};

export default withStyles(filterDrawerStyles)(FilterDrawer);
