// @vendors
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
// @material
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Typography,
  Zoom,
} from '@mui/material';
import withStyles from '@mui/styles/withStyles';
// @components
import LabelTag from '../labelTag/labelTag';
// @styles
import gameCardStyles from './gameCardStyles';
// @constants
import { ERROR_IMAGE } from '../../constants/index';

class GameCard extends Component {
  constructor(props) {
    super(props);

    this.state = { imageSrc: props.image };

    this.loadLabelTag = this.loadLabelTag.bind(this);
  }

  componentDidMount() {
    const { image } = this.props;
    this.checkImage(image);
  }

  checkImage(src) {
    const img = new Image();
    const imageSrc = ERROR_IMAGE;

    img.onerror = () => this.setState({ imageSrc });
    img.src = src;
  }

  loadLabelTag() {
    const { labels, gamesInformation, setLabelFilter } = this.props;

    return labels.map((label) => (
      <LabelTag
        key={label.id}
        label={label}
        gamesInformation={gamesInformation}
        setLabelFilter={setLabelFilter}
      />
    ));
  }

  render() {
    const {
      classes, description, title, plataform, gamesInformation,
    } = this.props;
    const { imageSrc } = this.state;
    const plataformData = gamesInformation.get('platforms').find((item) => item.id === plataform);
    const labelsData = this.loadLabelTag();

    return (
      <Zoom in>
        <Card className={classes.card}>
          <CardMedia
            className={classes.cardMedia}
            image={imageSrc}
          />
          <CardHeader
            title={title}
            subheader={get(plataformData, 'name', '')}
          />
          <CardContent className={classes.cardContent}>
            <Typography noWrap>
              {description}
            </Typography>

          </CardContent>
          <CardActions className={classes.cardActions}>
            <div className={classes.labels}>
              {labelsData}
            </div>
            <Button size="small" color="primary">
              View
            </Button>
          </CardActions>
        </Card>
      </Zoom>
    );
  }
}

GameCard.propTypes = {
  // idGame: PropTypes.number.isRequired,
  classes: PropTypes.object.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  plataform: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  labels: PropTypes.array.isRequired,
  gamesInformation: PropTypes.object.isRequired,
  setLabelFilter: PropTypes.func.isRequired,
};

export default withStyles(gameCardStyles)(GameCard);
