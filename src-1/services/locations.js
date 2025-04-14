// src/services/locations.js
import axios from 'axios';

const API_URL = 'https://api.example.com/locations'; // Replace with your actual API URL

export const getLocations = async (params = [], token = null, signal) => {
  const config = {
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
    signal,
  };

  const response = await axios.get(API_URL, { params, ...config });
  return response.data;
};

export const getLocationById = async (id, token = null, signal) => {
  const config = {
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
    signal,
  };

  const response = await axios.get(`${API_URL}/${id}`, config);
  return response.data;
};

export const updateLocationTags = async (id, tags, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(`${API_URL}/${id}/tags`, { tags }, config);
  return response.data;
};