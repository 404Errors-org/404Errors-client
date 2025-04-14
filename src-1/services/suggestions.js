// src/services/suggestions.js
import axios from 'axios';

const API_URL = '/api/suggestions';

export const getSuggestionsByLocation = async (locationId, token, signal) => {
  const response = await axios.get(`${API_URL}/${locationId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal,
  });
  return response.data;
};

export const sendSuggestion = async (locationId, suggestionText, token) => {
  const response = await axios.post(
    API_URL,
    { locationId, suggestionText },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};