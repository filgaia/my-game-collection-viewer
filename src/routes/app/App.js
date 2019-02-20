import React, { Component } from 'react';
import { hot } from 'react-hot-loader/root';
import './App.scss';
// @components
// import Header from './../../components/header/header';
import Catalog from './../../components/catalog/catalog';

class App extends Component {
    render() {
        return (
            <div className="app">
                <Catalog />
            </div>
        );
    }
}

export default hot(App);
