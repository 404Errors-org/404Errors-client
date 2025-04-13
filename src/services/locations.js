import axios from "axios";

const BASE_URL = "https://404errors-server-production.up.railway.app";

export const getLocations = async (filtersArray, categoriesArray) => {
  try {
    const response = await axios.get(`${BASE_URL}/locations`, {
      params: {
        tags: JSON.stringify(filtersArray),
        categories: JSON.stringify(categoriesArray),
      },
    });
    return response;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Помилка:", errorMessage);
  }
};
