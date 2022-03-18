import React from 'react';
import ReactDOM from 'react-dom';
import ThemeProvider from './context/themeContext';
import AuthProvider from './context/authContext';

import { BrowserRouter } from 'react-router-dom';

import './index.css';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
