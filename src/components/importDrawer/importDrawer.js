// @vendors
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
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

        this.onImportFile = this.onImportFile.bind(this);
        this.onToggleDrawer = this.onToggleDrawer.bind(this);
    }

    onImportFile(event) {
        this.props.importFile(get(event, 'target.files.0'));
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
                    <ListItem button key="import-file">
                        <input accept=".c, application/x-zip-compressed" className={classes.input} id="import-file" type="file" onChange={this.onImportFile} />
                        <label htmlFor="import-file" className={classes.labelFor}>
                            <ListItemIcon className={classes.listItem}>
                                <Tooltip title="From file" aria-label="From file">
                                    <FontAwesomeIcon icon="file-import" size="lg" />
                                </Tooltip>
                            </ListItemIcon>
                        </label>
                    </ListItem>
                    <ListItem button key="import-drive">
                        {logoutButton}
                    </ListItem>
                    {items}
                </List>
            </div >
        );
    }

    render() {
        const { importDrawer } = this.props;
        const items = this.buildItems();

        return (
            <React.Fragment>
                <IconButton color="inherit" onClick={() => this.onToggleDrawer(true)}>
                    <Tooltip title="Add Games..." aria-label="Add Games...">
                        <CloudDownload />
                    </Tooltip>
                </IconButton>
                <Drawer anchor="right" open={importDrawer} onClose={() => this.onToggleDrawer(false)}>
                    {items}
                </Drawer>
            </React.Fragment>
        );
    }
}

ImportDrawer.propTypes = {
    classes: PropTypes.object.isRequired,
    importDrawer: PropTypes.bool.isRequired,
    importFile: PropTypes.func.isRequired,
    toggleDrawer: PropTypes.func.isRequired
};

export default withStyles(importDrawerStyles)(ImportDrawer);
