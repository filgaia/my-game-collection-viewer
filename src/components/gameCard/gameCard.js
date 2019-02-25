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
    Chip
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
// @styles
import gameCardStyles from './gameCardStyles';
// @utilities
import { tagCodeToColor } from '../../utilities/utilities';
// @constants
import { CARD_OPACITY, ERROR_IMAGE } from './../../constants/index';

class GameCard extends Component {
    constructor(props) {
        super(props);

        this.state = { imageSrc: props.image };

        this.loadLabelTag = this.loadLabelTag.bind(this);
    }

    componentDidMount() {
        this.checkImage(this.props.image);
    }

    checkImage(src) {
        var img = new Image();
        const imageSrc = ERROR_IMAGE;

        img.onerror = (e) => this.setState({ imageSrc });
        img.src = src;
    }

    loadLabelTag() {
        const { labels } = this.props;

        return labels.map(label => {
            return (
                <Chip style={{ backgroundColor: tagCodeToColor(label.background_color, CARD_OPACITY) }}
                    key={label.id}
                    label={label.name}
                />
            );
        });
    }

    render() {
        const { classes, description, title, plataform, gamesInformation } = this.props;
        const { imageSrc } = this.state;
        const plataformData = gamesInformation.get('platforms').find(item => item.id === plataform);
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
                    <CardActions>
                        {labelsData}
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
    idGame: PropTypes.number.isRequired,
    classes: PropTypes.object.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    plataform: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    labels: PropTypes.array.isRequired,
    gamesInformation: PropTypes.object.isRequired
};

export default withStyles(gameCardStyles)(GameCard);
