// @vendors
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
    CloudDownload
} from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
// @styles
import importDrawerStyles from './importDrawerStyles';
// @constants
import { IMPORT_DRAWER } from '../../constants/index';
// @components
import Login from '../../components/login/login';

class ImportDrawer extends Component {
    constructor(props) {
        super(props);

        this.onToggleDrawer = this.onToggleDrawer.bind(this);
    }

    onToggleDrawer(open) {
        const response = { drawer: IMPORT_DRAWER, open };
        this.props.toggleDrawer({ response });
    }

    buildLogoutButton() {
        return <Login />;
    }

    buildItems() {
        const { classes } = this.props;
        const logoutButton = this.buildLogoutButton();
        const options = [
            { icon: 'file-import', title: 'From file' },
            { icon: ['fab', 'playstation'], title: 'Coming Soon...' },
            { icon: ['fab', 'xbox'], title: 'Coming Soon...' }
        ];

        const items = options.map((item, index) => (
            <ListItem button key={`ìmport-${index}`}>
                <ListItemIcon className={classes.listItem}>
                    <Tooltip title={item.title} aria-label={item.title}>
                        <FontAwesomeIcon icon={item.icon} size="lg" />
                    </Tooltip>
                </ListItemIcon>
            </ListItem>
        ));

        return (
            <div>
                <List>
                    <ListItem button key="import-drive">
                        {logoutButton}
                    </ListItem>
                    {items}
                </List>
            </div>
        );
    }

    render() {
        const { importDrawer } = this.props;
        const items = this.buildItems();

        return (
            <React.Fragment>
                <IconButton color="inherit" onClick={() => this.onToggleDrawer(true)}>
                    <Tooltip title="Import..." aria-label="Import...">
                        <CloudDownload />
                    </Tooltip>
                </IconButton>
                <Drawer anchor="right" open={importDrawer} onClose={() => this.onToggleDrawer(false)}>
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

ImportDrawer.propTypes = {
    classes: PropTypes.object.isRequired,
    importDrawer: PropTypes.bool.isRequired,
    toggleDrawer: PropTypes.func.isRequired
};

export default withStyles(importDrawerStyles)(ImportDrawer);
