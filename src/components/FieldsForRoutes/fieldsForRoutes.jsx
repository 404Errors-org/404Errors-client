import React, { useEffect, useRef } from "react";
import { ButtonSubmit } from "../../shared/forms.styled";
import { RouteBox } from "./fieldsForRoutes.styled";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import PropTypes from "prop-types";

const FieldsForRoutes = ({ setStartCoords, setEndCoords, onSearch, onClear, startLocation, endLocation }) => {
  const startGeocoderRef = useRef(null);
  const endGeocoderRef = useRef(null);

  useEffect(() => {
    mapboxgl.accessToken = process.env.REACT_APP_API_KEY;

    const startGeocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      placeholder: "Звідки вирушаємо?",
      flyTo: false,
      countries: "ua",
    });

    const endGeocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      placeholder: "Куди вирушаємо?",
      flyTo: false,
      countries: "ua",
    });

    const startGeocoderRefCurrent = startGeocoderRef.current;
    const endGeocoderRefCurrent = endGeocoderRef.current;

    if (startGeocoderRefCurrent) {
      startGeocoderRefCurrent.appendChild(startGeocoder.onAdd());
    }

    if (endGeocoderRefCurrent) {
      endGeocoderRefCurrent.appendChild(endGeocoder.onAdd());
    }

    startGeocoder.on("result", (event) => {
      const coords = event.result.geometry.coordinates;
      setStartCoords(coords);
    });

    endGeocoder.on("result", (event) => {
      const coords = event.result.geometry.coordinates;
      setEndCoords(coords);
    });

    if (startLocation) {
      startGeocoder.setInput(startLocation);
    }

    if (endLocation) {
      endGeocoder.setInput(endLocation);
    }

    return () => {
      if (startGeocoderRefCurrent) {
        startGeocoderRefCurrent.innerHTML = "";
      }
      if (endGeocoderRefCurrent) {
        endGeocoderRefCurrent.innerHTML = "";
      }
    };
  }, [setStartCoords, setEndCoords, startLocation, endLocation]);

  return (
    <RouteBox role="search">
      <div
        ref={startGeocoderRef}
        className="point"
        
        aria-labelledby="start-geocoder-label"
        aria-describedby="start-geocoder-description"
      ></div>
      <div
        ref={endGeocoderRef}
        className="search"
        aria-labelledby="end-geocoder-label"
        aria-describedby="end-geocoder-description"
      ></div>

      <ButtonSubmit 
        onClick={onSearch} 
        
        aria-label="Пошук маршруту" 
        aria-describedby="search-route-description"
      >
        Пошук маршруту
      </ButtonSubmit>
      <ButtonSubmit 
        onClick={onClear} 
        aria-label="Очистити маршрут" 
        aria-describedby="clear-route-description"
      >
        Очистити маршрут
      </ButtonSubmit>
    </RouteBox>
  );
};

FieldsForRoutes.propTypes = {
  setStartCoords: PropTypes.func.isRequired,
  setEndCoords: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  startLocation: PropTypes.string.isRequired,
  endLocation: PropTypes.string.isRequired,
};

export default FieldsForRoutes;
