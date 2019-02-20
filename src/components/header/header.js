import React, { Component } from 'react';
// @assets
import logo from './logo.svg';
// @material
import Button from '@material-ui/core/Button';

class Header extends Component {
    render() {
        return (
            <header className="app__header">
                <img src={logo} className="app__logo" alt="logo" />
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                    className="app__link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Button variant="outlined" color="primary">
                        Learn React
                    </Button>
                </a>
            </header>
        );
    }
}

export default Header;
