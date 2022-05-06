import React from 'react';
import ReactDOM from 'react-dom';
import ThemeProvider from './context/themeContext';
import AuthProvider from './context/authContext';
import { PersistGate } from 'redux-persist/integration/react';

import { Provider } from 'react-redux';
import store, { persistor } from './store';

import { BrowserRouter } from 'react-router-dom';

import './index.css';
import App from './App';
import StepProvider from './context/stepContext';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
