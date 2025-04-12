import React, { useRef, useEffect, useState } from "react";
import { Box } from "./map.styled";
import mapboxgl from "mapbox-gl";
import FieldsForRoutes from "../FieldsForRoutes/fieldsForRoutes";
import { usePlace } from "../../context/placeContext";

const Map = ({ selectedCategories }) => {
  const { changeSelectLocation } = usePlace();
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [mapLoaded, setMapLoaded] = useState(false);
  const startCoordsRef = useRef(null);
  const endCoordsRef = useRef(null);
  const mapRef = useRef();
  const mapContainerRef = useRef();
  const mapboxAccessToken = process.env.REACT_APP_API_KEY;
  const mapInstance = useRef(null);

  const buildRoute = () => {
    if (startCoordsRef.current && endCoordsRef.current) {
      const routeUrl = `https://api.mapbox.com/directions/v5/mapbox/walking/${startCoordsRef.current[0]},${startCoordsRef.current[1]};${endCoordsRef.current[0]},${endCoordsRef.current[1]}?geometries=geojson&access_token=${mapboxAccessToken}`;

      fetch(routeUrl)
        .then((response) => response.json())
        .then((data) => {
          const route = data.routes[0].geometry.coordinates;

          if (mapInstance.current && mapInstance.current.getLayer("route")) {
            mapInstance.current.removeLayer("route");
            mapInstance.current.removeSource("route");
          }

          if (mapInstance.current) {
            mapInstance.current.addLayer({
              id: "route",
              type: "line",
              source: {
                type: "geojson",
                data: {
                  type: "Feature",
                  geometry: {
                    type: "LineString",
                    coordinates: route,
                  },
                },
              },
              paint: {
                "line-color": "#3887be",
                "line-width": 5,
              },
            });
          }
        });
    }
  };

  useEffect(() => {
    mapboxgl.accessToken = mapboxAccessToken;

    if (!mapRef.current) {
      mapInstance.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [24.0303, 49.8429],
        zoom: 12,
      });

      const map = mapInstance.current;

      map.on("load", () => {
        setMapLoaded(true);

        const imageArray = [
          { url: "/images/restaurant.png", name: "restaurant-icon" },
          { url: "/images/hotel.png", name: "hotel-icon" },
          { url: "/images/location.png", name: "foodmarket-icon" },
          { url: "/images/hospital.png", name: "hospital-icon" },
          { url: "/images/park-location.png", name: "park-icon" },
          { url: "/images/pin.png", name: "entertaiment-icon" },
          { url: "/images/museum.png", name: "museum-icon" },
          { url: "/images/pharmacy.png", name: "pharmacy-icon" },
          { url: "/images/petrol-station.png", name: "fuel-icon" },
          { url: "/images/money.png", name: "bank-icon" },
          { url: "/images/post-office.png", name: "postoffice-icon" },
          { url: "/images/phone.png", name: "electricshop-icon" },
        ];

        imageArray.forEach(({ url, name }) => {
          map.loadImage(url, (error, image) => {
            if (error) throw error;
            if (!map.hasImage(name)) {
              map.addImage(name, image);
            }
          });
        });

        map.on("click", "accessible-places-layer", (e) => {
          e.preventDefault();
          const properties = e.features[0].properties;
          const coordinates = e.features[0].geometry.coordinates;

          const updatedProperties = {
            ...properties,          
            coordinate: coordinates,
          };

          changeSelectLocation(updatedProperties);
        });

        map.on("click", (e) => {
          if (map.getLayer("accessible-places-layer")) {
            const features = map.queryRenderedFeatures(e.point, {
              layers: ["accessible-places-layer"],
            });
            
            if (features.length > 0) {
              return;
            }
          }

          const clickedCoords = e.lngLat;

          if (!startCoordsRef.current) {
            startCoordsRef.current = [clickedCoords.lng, clickedCoords.lat];
            setStartLocation(`${clickedCoords.lng}, ${clickedCoords.lat}`);
          } else if (!endCoordsRef.current) {
            endCoordsRef.current = [clickedCoords.lng, clickedCoords.lat];
            setEndLocation(`${clickedCoords.lng}, ${clickedCoords.lat}`);
          }
        });
      });
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
      }
    };
  }, [mapboxAccessToken]);

  useEffect(() => {
    if (mapLoaded && mapInstance.current) {
      const map = mapInstance.current;

      if (map.getLayer("accessible-places-layer")) {
        map.removeLayer("accessible-places-layer");
      }
      if (map.getSource("accessible-places")) {
        map.removeSource("accessible-places");
      }

      if (selectedCategories.length === 0) {
        return;
      }

      map.addSource("accessible-places", {
        type: "geojson",
        data: "/points.json",
      });

      map.addLayer({
        id: "accessible-places-layer",
        type: "symbol",
        source: "accessible-places",
        layout: {
          "icon-image": [
            "match",
            ["get", "category"],
            ...selectedCategories.reduce((acc, category) => {
              acc.push(category, `${category}-icon`);
              return acc;
            }, []),
            "custom-icon",
          ],
          "icon-allow-overlap": true,
          "icon-size": 0.07,
        },
      });
    }
  }, [selectedCategories, mapLoaded]);

  const handleClear = () => {
    startCoordsRef.current = null;
    endCoordsRef.current = null;

    setStartLocation("");
    setEndLocation("");

    if (mapInstance.current && mapInstance.current.getLayer("route")) {
      mapInstance.current.removeLayer("route");
      mapInstance.current.removeSource("route");
    }
  };

  

  return (
    <Box>
      <div ref={mapContainerRef} style={{ width: "100%", height: "100vh" }} />
      <FieldsForRoutes
        startLocation={startLocation}
        endLocation={endLocation}
        setStartCoords={(coords) => {
          startCoordsRef.current = coords;
          setStartLocation(`${coords[0]}, ${coords[1]}`);
        }}
        setEndCoords={(coords) => {
          endCoordsRef.current = coords;
          setEndLocation(`${coords[0]}, ${coords[1]}`);
        }}
        onSearch={buildRoute}
        onClear={handleClear}
      />
    </Box>
  );
};

export default Map;
