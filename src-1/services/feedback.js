// src/services/feedback.js
import axios from 'axios';

const API_URL = 'https://api.example.com/feedback'; // Replace with your actual API URL

export const getFeedbacksByLocation = async (locationId, token) => {
  const response = await axios.get(`${API_URL}/${locationId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const handleAddFeedback = async (event, user, feedbacks, setFeedbacks, setNewFeedback, setRating, rating, newFeedback, locationId) => {
  event.preventDefault();
  
  const feedbackData = {
    content: newFeedback,
    rate: rating,
    user: {
      id: user.id,
      username: user.username,
    },
  };

  const response = await axios.post(`${API_URL}/${locationId}`, feedbackData, {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });

  setFeedbacks([...feedbacks, response.data]);
  setNewFeedback('');
  setRating(0);
};