import './index.scss';

//@vendors
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
//@config
import configureStore from '../src/store/configureStore';
import * as serviceWorker from './serviceWorker';
//@components
import App from './routes/app/App';
import Login from './components/login/login';

const store = configureStore();

ReactDOM.render(
    <Provider store={store}>
        <App login={<Login/>}/>
    </Provider>,
    document.getElementById('root')
);

serviceWorker.register();
