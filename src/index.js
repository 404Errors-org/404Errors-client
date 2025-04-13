import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App/app";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import { AuthProvider } from './context/authContext';
import { theme } from "./constans/theme";
import { PlaceProvider } from "./context/placeContext";
import { FiltersProvider } from "./context/filtersContext";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <PlaceProvider>
        <BrowserRouter>
          <FiltersProvider>
            <ThemeProvider theme={theme}>
              <App />
            </ThemeProvider>
          </FiltersProvider>
        </BrowserRouter>
      </PlaceProvider>
    </AuthProvider>
  </React.StrictMode>
);
