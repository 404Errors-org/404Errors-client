import axios from "axios";

const BASE_URL = "https://404errors-server-production.up.railway.app";

export const sendSuggestion = async (locationId, suggestionText, token) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/suggestions?locationId=${locationId}`,
      {
        content: suggestionText,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Помилка при відправленні пропозиції:", error);
    throw new Error("Не вдалося відправити пропозицію");
  }
};

export const getSuggestionsByLocation = async (locationId, token, signal) => {
  try {
    const response = await axios.get(`${BASE_URL}/suggestions/location/${locationId}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
      signal: signal,
    });
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      return [];
    }
    console.error("Помилка при отриманні пропозицій:", error);
    throw error;
  }
};
