import React, { Component } from 'react';
import logo from './logo.svg';
import './App.scss';

import Button from '@material-ui/core/Button';

class App extends Component {
  render() {
    return (
      <div className="app">
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
      </div>
    );
  }
}

export default App;
