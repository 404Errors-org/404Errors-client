import axios from "axios";

const BASE_URL = "https://404errors-server-production.up.railway.app";

export const getLocations = async (filtersArray = [], categoriesArray = []) => {
  try {
    const filters = Array.isArray(filtersArray) ? filtersArray : [];
    const categories = Array.isArray(categoriesArray) ? categoriesArray : [];

    const response = await axios.get(`${BASE_URL}/locations`, {
      params: {
        tags: JSON.stringify(filters),
        categories: JSON.stringify(categories),
      },
    });
    return response;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Помилка:", errorMessage);
    return { data: [] };
  }
};
