import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, StyledEngineProvider, createTheme } from '@mui/material/styles';

// import makeStyles from '@mui/styles/makeStyles';

import configureStore from './store/configureStore';
import './index.css';
import App from './routes/app/App';
import reportWebVitals from './reportWebVitals';

const store = configureStore();

const theme = createTheme();

/* const useStyles = makeStyles((theme) => {
    root: {
        // some CSS that access to theme
    }
}); */

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </StyledEngineProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
