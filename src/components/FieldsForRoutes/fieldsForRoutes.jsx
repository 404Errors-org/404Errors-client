import React, { useEffect, useRef } from "react";
import { ButtonSubmit } from "../../shared/forms.styled";
import { RouteBox } from "./fieldsForRoutes.styled";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

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
      countries: 'ua',
    });

    const endGeocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      placeholder: "Куди вирушаємо?",
      flyTo: false,
      countries: 'ua',
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
    <RouteBox>
      <div ref={startGeocoderRef} className="point"></div>
      <div ref={endGeocoderRef} className="search"></div>

      <ButtonSubmit onClick={onSearch}>Пошук маршруту</ButtonSubmit>
      <ButtonSubmit onClick={onClear}>Очистити маршрут</ButtonSubmit>
    </RouteBox>
  );
};

export default FieldsForRoutes;
