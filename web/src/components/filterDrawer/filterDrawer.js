/* eslint-disable react/prop-types */
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
  Tooltip,
} from '@mui/material';
// https://material.io/tools/icons/?style=baseline
import {
  FilterList,
} from '@mui/icons-material';
import withStyles from '@mui/styles/withStyles';
// @componets
import LabelTag from '../labelTag/labelTag';
// @styles
import filterDrawerStyles from './filterDrawerStyles';
// @constants
import { FILTER_DRAWER } from '../../constants/index';

export class FilterDrawer extends Component {
  constructor(props) {
    super(props);

    this.onToggleDrawer = this.onToggleDrawer.bind(this);
  }

  onToggleDrawer(open) {
    const { toggleDrawer } = this.props;
    const response = { drawer: FILTER_DRAWER, open };
    toggleDrawer({ response });
  }

  buildItems() {
    const { classes, gamesInformation, setLabelFilter } = this.props;
    const labelsTagsItems = gamesInformation.get('labels');

    const Tag = React.forwardRef(({ item }, ref) => (
      <div className={classes.tagDiv} ref={ref}>
        <LabelTag
          key={item.id}
          isDrawer
          label={item}
          gamesInformation={gamesInformation}
          setLabelFilter={setLabelFilter}
        />
      </div>
    ));

    const items = labelsTagsItems ? labelsTagsItems.map((item, index) => (
      <ListItem button key={`filter-${index}`}>
        <ListItemIcon className={classes.listItem}>
          <Tooltip title={item.name} aria-label={item.name}>
            <Tag item={item} />
          </Tooltip>
        </ListItemIcon>
      </ListItem>
    )) : null;

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
      <>
        <IconButton color="inherit" onClick={() => this.onToggleDrawer(true)} size="large">
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
      </>
    );
  }
}

FilterDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  filterDrawer: PropTypes.bool.isRequired,
  gamesInformation: PropTypes.object.isRequired,
  setLabelFilter: PropTypes.func.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
};

export default withStyles(filterDrawerStyles)(FilterDrawer);
