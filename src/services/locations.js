import axios from "axios";

const BASE_URL = "https://404errors-server-production.up.railway.app";

const locationsCache = {
  data: null,
  timestamp: 0,
  expiresIn: 30000,
};

let debounceTimer = null;

export const getLocations = async (filtersArray = [], categoriesArray = [], signal) => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  if (locationsCache.data && Date.now() - locationsCache.timestamp < locationsCache.expiresIn) {
    return locationsCache.data;
  }

  return new Promise((resolve) => {
    debounceTimer = setTimeout(async () => {
      try {
        const filters = Array.isArray(filtersArray) ? filtersArray : [];
        const categories = Array.isArray(categoriesArray) ? categoriesArray : [];

        const timeoutController = new AbortController();
        const timeoutId = setTimeout(() => {
          timeoutController.abort();
        }, 5000);

        const combinedSignal = signal ? AbortSignal.any([signal, timeoutController.signal]) : timeoutController.signal;

        const response = await axios.get(`${BASE_URL}/locations`, {
          params: {
            tags: JSON.stringify(filters),
            categories: JSON.stringify(categories),
          },
          signal: combinedSignal,
        });

        clearTimeout(timeoutId);

        locationsCache.data = response;
        locationsCache.timestamp = Date.now();

        resolve(response);
      } catch (error) {
        if (axios.isCancel(error)) {
          if (locationsCache.data) {
            resolve(locationsCache.data);
          } else {
            resolve({ data: [] });
          }
          return;
        }

        console.error("Error fetching locations:", error.message);
        resolve({ data: [] });
      }
    }, 300);
  });
};
