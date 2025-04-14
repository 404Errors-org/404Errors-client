import axios from "axios";

const BASE_URL = "https://404errors-server-production.up.railway.app";

export const sendSuggestion = async (locationId, suggestionText, token) => {
  const response = await axios.fetch(`${BASE_URL}=${locationId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content: suggestionText }),
  });

  if (!response.ok) {
    throw new Error("Помилка при відправленні пропозиції");
  }

  return await response.json();
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
