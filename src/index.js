import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App/app';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@emotion/react';
import { theme } from './constans/theme';
// import { AuthProvider } from './context/authContext';
import { PlaceProvider } from './context/placeContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <AuthProvider> */}
      <PlaceProvider>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </BrowserRouter>
      </PlaceProvider>
    {/* </AuthProvider> */}
  </React.StrictMode>
);
