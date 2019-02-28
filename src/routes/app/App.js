import './App.scss';
//@vendors
import React, { Component } from 'react';
import { hot } from 'react-hot-loader/root';
// @routes
import Home from '../home/home';

class App extends Component {
    render() {
        return (
            <div className="app">
                <Home />
            </div>
        );
    }
}

export default hot(App);
