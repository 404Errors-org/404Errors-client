import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { Box } from "./map.styled";
import mapboxgl from "mapbox-gl";
import FieldsForRoutes from "../FieldsForRoutes/fieldsForRoutes";
import { usePlace } from "../../context/placeContext";
import { useFilters } from "../../context/filtersContext";

const Map = () => {
  const { changeSelectLocation } = usePlace();
  const { locations, selectedCategories } = useFilters();

  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [mapLoaded, setMapLoaded] = useState(false);
  const [locationVersion, setLocationVersion] = useState(0);
  const prevLocationsRef = useRef(null);

  const startCoordsRef = useRef(null);
  const endCoordsRef = useRef(null);
  const mapRef = useRef();
  const mapContainerRef = useRef();
  const mapboxAccessToken = process.env.REACT_APP_API_KEY;
  const mapInstance = useRef(null);
  const popupsRef = useRef([]);

  const categoryValues = useMemo(
    () => [
      "restaurant",
      "hotel",
      "foodmarket",
      "hospital",
      "park",
      "entertaiment",
      "museum",
      "pharmacy",
      "fuel",
      "bank",
      "postoffice",
      "electricshop",
    ],
    []
  );

  const buildRoute = useCallback(() => {
    if (!mapInstance.current || !mapInstance.current.isStyleLoaded()) return;

    if (startCoordsRef.current && endCoordsRef.current) {
      const routeUrl = `https://api.mapbox.com/directions/v5/mapbox/walking/${startCoordsRef.current[0]},${startCoordsRef.current[1]};${endCoordsRef.current[0]},${endCoordsRef.current[1]}?geometries=geojson&access_token=${mapboxAccessToken}`;

      fetch(routeUrl)
        .then((response) => response.json())
        .then((data) => {
          if (!data.routes || data.routes.length === 0) {
            console.error("No route found");
            return;
          }

          const map = mapInstance.current;
          if (!map || !map.isStyleLoaded()) return;

          if (map.getLayer("route")) {
            map.removeLayer("route");
            map.removeSource("route");
          }

          const route = data.routes[0].geometry.coordinates;
          map.addLayer({
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
        })
        .catch((err) => {
          console.error("Error building route:", err);
        });
    }
  }, [mapboxAccessToken]);

  const addMarker = useCallback((type, coordinates) => {
    if (!mapInstance.current || !mapInstance.current.isStyleLoaded()) return;

    const map = mapInstance.current;
    const id = `${type}-point`;

    if (map.getLayer(id)) {
      map.removeLayer(id);
    }
    if (map.getSource(id)) {
      map.removeSource(id);
    }

    map.addSource(id, {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: coordinates,
        },
      },
    });

    map.addLayer({
      id: id,
      type: "circle",
      source: id,
      paint: {
        "circle-radius": 8,
        "circle-color": type === "start" ? "#33cc33" : "#ff3333",
        "circle-stroke-width": 2,
        "circle-stroke-color": "#ffffff",
      },
    });
  }, []);

  useEffect(() => {
    mapboxgl.accessToken = mapboxAccessToken;

    if (!mapRef.current) {
      try {
        mapInstance.current = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: "mapbox://styles/mapbox/streets-v11",
          center: [24.0303, 49.8429],
          zoom: 12,
        });

        const map = mapInstance.current;
        mapRef.current = map;

        map.on("style.load", () => {
          setMapLoaded(true);
        });

        map.on("load", () => {
          setMapLoaded(true);

          const loadImage = (url, name) => {
            return new Promise((resolve, reject) => {
              if (map.hasImage(name)) {
                resolve();
                return;
              }

              map.loadImage(url, (error, image) => {
                if (error) {
                  console.error(`Error loading image ${name}:`, error);
                  reject(error);
                  return;
                }

                if (!map.hasImage(name)) {
                  map.addImage(name, image);
                }
                resolve();
              });
            });
          };

          loadImage("/images/pin.png", "pin-icon")
            .then(() => {
              const imagePromises = [
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
              ].map(({ url, name }) => loadImage(url, name));

              return Promise.all(imagePromises);
            })
            .catch((err) => {
              console.error("Error loading map images:", err);
            });
        });
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapRef.current = null;
      }
    };
  }, [mapboxAccessToken]);

  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !mapLoaded) return;

    const handlePlaceClick = (e) => {
      if (!e.features || e.features.length === 0) return;

      e.preventDefault();
      const properties = e.features[0].properties;
      const coordinates = e.features[0].geometry.coordinates;

      const updatedProperties = {
        ...properties,
        coordinate: coordinates,
      };

      changeSelectLocation(updatedProperties);
    };

    const handleMapClick = (e) => {
      if (!map.isStyleLoaded()) return;

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
        addMarker("start", [clickedCoords.lng, clickedCoords.lat]);
      } else if (!endCoordsRef.current) {
        endCoordsRef.current = [clickedCoords.lng, clickedCoords.lat];
        setEndLocation(`${clickedCoords.lng}, ${clickedCoords.lat}`);
        addMarker("end", [clickedCoords.lng, clickedCoords.lat]);
      }
    };

    const removeAllPopups = () => {
      if (popupsRef.current.length > 0) {
        popupsRef.current.forEach((popup) => popup.remove());
        popupsRef.current = [];
      }
    };

    map.on("mouseenter", "accessible-places-layer", (e) => {
      map.getCanvas().style.cursor = "pointer";

      const coordinates = e.features[0].geometry.coordinates.slice();
      const name = e.features[0].properties.name || "Локація";

      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        className: "map-tooltip",
        offset: 15,
        maxWidth: "200px",
      })
        .setLngLat(coordinates)
        .setHTML(`<div>Натисніть для деталей</div>`)
        .addTo(map);

      popupsRef.current.push(popup);
    });

    map.on("mouseleave", "accessible-places-layer", () => {
      map.getCanvas().style.cursor = "";
      removeAllPopups();
    });

    map.on("click", "accessible-places-layer", handlePlaceClick);
    map.on("click", handleMapClick);

    return () => {
      if (map) {
        map.off("click", "accessible-places-layer", handlePlaceClick);
        map.off("click", handleMapClick);
        map.off("mouseenter", "accessible-places-layer");
        map.off("mouseleave", "accessible-places-layer");
        removeAllPopups();
      }
    };
  }, [mapLoaded, addMarker, changeSelectLocation]);

  useEffect(() => {
    if (!locations) return;

    const currentLocationsStr = JSON.stringify(locations);
    const prevLocationsStr = prevLocationsRef.current ? JSON.stringify(prevLocationsRef.current) : null;

    if (currentLocationsStr !== prevLocationsStr) {
      prevLocationsRef.current = locations;
      setLocationVersion((prev) => prev + 1);
    }
  }, [locations]);

  useEffect(() => {
    const map = mapInstance.current;
    if (!mapLoaded || !map || !map.isStyleLoaded() || !locations || !locations.features) return;

    let styleElement;
    if (!document.getElementById("map-tooltip-style")) {
      styleElement = document.createElement("style");
      styleElement.id = "map-tooltip-style";
      styleElement.innerHTML = `
        .map-tooltip {
          background: white !important;
          border-radius: 6px !important;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2) !important;
          z-index: 999 !important;
        }
        .map-tooltip .mapboxgl-popup-content {
          padding: 8px 12px !important;
          border-radius: 6px !important;
          font-size: 14px !important;
          font-weight: 500 !important;
          text-align: center !important;
          color: #026C6C !important;
        }
        .map-tooltip .mapboxgl-popup-tip {
          border-top-color: white !important;
          border-bottom-color: white !important;
          border-left-color: white !important;
          border-right-color: white !important;
        }
        .map-tooltip .mapboxgl-popup-close-button {
          display: none !important;
        }
      `;
      document.head.appendChild(styleElement);
    }

    const removeExistingLayerAndSource = () => {
      if (map.getLayer("accessible-places-layer")) {
        map.removeLayer("accessible-places-layer");
      }
      if (map.getSource("accessible-places")) {
        map.removeSource("accessible-places");
      }
    };

    const addLayerToMap = () => {
      try {
        map.addSource("accessible-places", {
          type: "geojson",
          data: locations,
        });

        map.addLayer({
          id: "accessible-places-layer",
          type: "symbol",
          source: "accessible-places",
          layout: {
            "icon-image": [
              "match",
              ["get", "category"],
              ...(selectedCategories && selectedCategories.length > 0 ? selectedCategories : categoryValues).reduce(
                (acc, category) => {
                  acc.push(category, `${category}-icon`);
                  return acc;
                },
                []
              ),
              "pin-icon",
            ],
            "icon-allow-overlap": true,
            "icon-size": 0.07,
            "icon-cursor": "pointer",
          },
        });
      } catch (error) {
        console.error("Error adding map layer:", error);
      }
    };

    const updateLocationsLayer = () => {
      try {
        removeExistingLayerAndSource();
        addLayerToMap();
      } catch (error) {
        console.error("Error updating map layers:", error);
      }
    };

    if (map.isStyleLoaded()) {
      updateLocationsLayer();
    } else {
      map.once("styledata", updateLocationsLayer);
    }

    return () => {
      if (styleElement) {
        document.head.removeChild(styleElement);
      }
    };
  }, [mapLoaded, locationVersion, selectedCategories, categoryValues]);

  const handleClear = useCallback(() => {
    startCoordsRef.current = null;
    endCoordsRef.current = null;

    setStartLocation("");
    setEndLocation("");

    if (mapInstance.current && mapInstance.current.isStyleLoaded()) {
      const map = mapInstance.current;

      if (map.getLayer("route")) {
        map.removeLayer("route");
        map.removeSource("route");
      }

      if (map.getLayer("start-point")) {
        map.removeLayer("start-point");
      }
      if (map.getSource("start-point")) {
        map.removeSource("start-point");
      }
      if (map.getLayer("end-point")) {
        map.removeLayer("end-point");
      }
      if (map.getSource("end-point")) {
        map.removeSource("end-point");
      }
    }
  }, []);

  const handleSetStartCoords = useCallback(
    (coords) => {
      startCoordsRef.current = coords;
      setStartLocation(`${coords[0]}, ${coords[1]}`);
      addMarker("start", coords);
    },
    [addMarker]
  );

  const handleSetEndCoords = useCallback(
    (coords) => {
      endCoordsRef.current = coords;
      setEndLocation(`${coords[0]}, ${coords[1]}`);
      addMarker("end", coords);
    },
    [addMarker]
  );

  return (
    <Box>
      <div ref={mapContainerRef} style={{ width: "100%", height: "100vh" }} />
      <FieldsForRoutes
        startLocation={startLocation}
        endLocation={endLocation}
        setStartCoords={handleSetStartCoords}
        setEndCoords={handleSetEndCoords}
        onSearch={buildRoute}
        onClear={handleClear}
      />
    </Box>
  );
};

export default React.memo(Map);
