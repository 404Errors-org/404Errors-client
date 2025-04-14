import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { getLocations } from "../services/locations";
import PropTypes from "prop-types";

const FiltersContext = createContext();

export const FiltersProvider = ({ children }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [locations, setLocations] = useState({ type: "FeatureCollection", features: [] });
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const initialLoadRef = useRef(true);
  const isUpdatingURLRef = useRef(false);

  useEffect(() => {
    if (initialLoadRef.current) {
      initialLoadRef.current = false;

      const urlCategories = searchParams.get("categories");
      const urlTags = searchParams.get("tags") || searchParams.get("filters");

      const initialCategories = parseQueryParam(urlCategories);
      const initialFilters = parseQueryParam(urlTags);

      if (initialCategories.length > 0) {
        setSelectedCategories(initialCategories);
      }

      if (initialFilters.length > 0) {
        setSelectedFilters(initialFilters);
      }

      fetchLocations(initialFilters, initialCategories);
    }
  }, []);

  const fetchLocations = (filters = [], categories = []) => {
    setIsLoading(true);
    getLocations(filters, categories)
      .then((data) => {
        if (data && Array.isArray(data.data)) {
          setLocations(toGeoJSON(data.data));
        } else {
          console.error("getLocations returned non-array data:", data);
          setLocations({ type: "FeatureCollection", features: [] });
        }
      })
      .catch((error) => {
        console.error("Error fetching locations:", error);
        setLocations({ type: "FeatureCollection", features: [] });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const parseQueryParam = (param) => {
    if (!param) return [];

    try {
      if (param.startsWith("[") && param.endsWith("]")) {
        const parsed = JSON.parse(param);
        return Array.isArray(parsed) ? parsed : [];
      } else {
        return param.split(",").filter((item) => item.trim() !== "");
      }
    } catch (e) {
      console.error("Error parsing query parameter:", e);
      return [];
    }
  };

  useEffect(() => {
    if (initialLoadRef.current || isLoading || isUpdatingURLRef.current) return;

    isUpdatingURLRef.current = true;

    const params = new URLSearchParams();

    if (selectedCategories.length > 0) {
      params.set("categories", JSON.stringify(selectedCategories));
    }

    if (selectedFilters.length > 0) {
      params.set("tags", JSON.stringify(selectedFilters));
    }

    setSearchParams(params, { replace: true });
    fetchLocations(selectedFilters, selectedCategories);

    setTimeout(() => {
      isUpdatingURLRef.current = false;
    }, 100);
  }, [selectedFilters, selectedCategories]);

  const handleFilters = (value) => {
    setSelectedFilters((prevSelected) => {
      return prevSelected.includes(value)
        ? prevSelected.filter((filter) => filter !== value)
        : [...prevSelected, value];
    });
  };

  const handlePlaces = (value) => {
    setSelectedCategories((prevSelected) => {
      return prevSelected.includes(value)
        ? prevSelected.filter((category) => category !== value)
        : [...prevSelected, value];
    });
  };

  const toGeoJSON = (locations) => {
    if (!Array.isArray(locations)) {
      console.error("Invalid locations data:", locations);
      return { type: "FeatureCollection", features: [] };
    }

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
        isLoading,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
};

FiltersProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useFilters = () => {
  return useContext(FiltersContext);
};
