import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App/app";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import { theme } from "./constans/theme";
import { PlaceProvider } from "./context/placeContext";
import { FiltersProvider } from "./context/filtersContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <PlaceProvider>
      <BrowserRouter>
        <FiltersProvider>
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </FiltersProvider>
      </BrowserRouter>
    </PlaceProvider>
  </React.StrictMode>
);
