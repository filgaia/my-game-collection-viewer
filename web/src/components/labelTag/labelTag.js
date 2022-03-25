// @vendors
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
// @material
import { Chip } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
// @styles
import labelTagStyles from './labelTagStyles';
// @utilities
import { tagCodeToColor } from '../../utilities/index';
// @constants
import { CARD_OPACITY } from '../../constants/index';

export class LabelTag extends Component {
  constructor(props) {
    super(props);

    this.handleClickFilter = this.handleClickFilter.bind(this);
  }

  handleClickFilter() {
    const { gamesInformation, setLabelFilter, label } = this.props;
    if (gamesInformation.get('idLabelFilter') === label.id) {
      setLabelFilter(null);
    } else {
      setLabelFilter(label.id);
    }
  }

  render() {
    const {
      classes, isDrawer, label, gamesInformation,
    } = this.props;

    const labelSeleted = gamesInformation.get('idLabelFilter') === label.id;
    const opacity = labelSeleted ? 1 : CARD_OPACITY;
    const tagColor = tagCodeToColor(label.background_color, opacity);

    const classTag = classNames(
      classes.chip,
      {
        [classes.seletedChip]: labelSeleted,
        [classes.drawerChip]: isDrawer,
      },
    );

    return (
      <Chip
        className={classTag}
        style={{ backgroundColor: tagColor }}
        onClick={this.handleClickFilter}
        key={`label-${label.id}`}
        label={label.name}
        clickable
      />
    );
  }
}

LabelTag.propTypes = {
  classes: PropTypes.object.isRequired,
  gamesInformation: PropTypes.object.isRequired,
  isDrawer: PropTypes.bool,
  label: PropTypes.object.isRequired,
  setLabelFilter: PropTypes.func.isRequired,
};

LabelTag.defaultProps = {
  isDrawer: false,
};

export default withStyles(labelTagStyles)(LabelTag);
