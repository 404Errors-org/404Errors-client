import React, { createContext, useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getLocations } from "../services/locations";

const FiltersContext = createContext();

export const FiltersProvider = ({ children }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [locations, setLocations] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const categoriesFromQuery = searchParams.get("categories");
    const filtersFromQuery = searchParams.get("filters");

    if (!categoriesFromQuery && !filtersFromQuery) {
      getLocations([], [])
        .then((data) => {
          if (Array.isArray(data.data)) {
            setLocations(toGeoJSON(data.data));
          }
        })
        .catch((err) => console.error("Error loading all locations:", err));
      return;
    }

    const parsedCategories = categoriesFromQuery ? categoriesFromQuery.split(",") : [];
    const parsedFilters = filtersFromQuery ? filtersFromQuery.split(",") : [];

    setSelectedCategories(parsedCategories);
    setSelectedFilters(parsedFilters);

    getLocations(parsedFilters, parsedCategories)
      .then((data) => {
        if (Array.isArray(data.data)) {
          setLocations(toGeoJSON(data.data));
        } else {
          console.error("getLocations returned non-array data:", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching locations:", error);
      });
  }, [searchParams]);

  const handlePlaces = (value) => {
    setSelectedCategories((prevSelected) => {
      const newCategories = prevSelected.includes(value)
        ? prevSelected.filter((category) => category !== value)
        : [...prevSelected, value];

      return newCategories;
    });
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (selectedCategories.length > 0) {
      params.set("categories", selectedCategories.join(","));
    } else {
      params.delete("categories");
    }
    setSearchParams(params);
  }, [selectedCategories]);

  const handleFilters = (value) => {
    setSelectedFilters((prevSelected) => {
      const newFilters = prevSelected.includes(value)
        ? prevSelected.filter((filter) => filter !== value)
        : [...prevSelected, value];

      return newFilters;
    });
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (selectedFilters.length > 0) {
      params.set("filters", selectedFilters.join(","));
    } else {
      params.delete("filters");
    }
    setSearchParams(params);
  }, [selectedFilters]);

  const toGeoJSON = (locations) => {
    return {
      type: "FeatureCollection",
      features: locations.map((loc) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [loc.geometry.horizontalCoordinate, loc.geometry.verticalCoordinate],
        },
        properties: {
          id: loc.id,
          name: loc.name,
          category: loc.category,
          tags: loc.tags,
          phoneNumber: loc.phoneNumber,
          locationDefaultId: loc.locationDefaultId,
        },
      })),
    };
  };

  return (
    <FiltersContext.Provider
      value={{
        locations,
        selectedCategories,
        selectedFilters,
        handlePlaces,
        handleFilters,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
};

export const useFilters = () => {
  return useContext(FiltersContext);
};
