import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './routes/app/App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import configureStore from '../src/store/configureStore';

const store = configureStore();

ReactDOM.render((
    <Provider store={store}>
        <App />
    </Provider>
), document.getElementById('root'));

serviceWorker.register();
