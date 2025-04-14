import axios from "axios";
const BASE_URL = "https://404errors-server-production.up.railway.app";

const handleAddFeedback = async (
  e,
  user,
  feedbacks,
  setFeedbacks,
  setNewFeedback,
  setRating,
  rating,
  newFeedback,
  locationId
) => {
  e.preventDefault();

  if (!user) {
    return null;
  }

  const username = user.username || "Користувач";

  if (feedbacks.some((feedback) => feedback.author === username)) {
    return null;
  }

  if (newFeedback.trim()) {
    if (!locationId) {
      console.error("locationId не визначений");
      return null;
    }

    try {
      const token = user.token;
      const response = await axios.post(
        `${BASE_URL}/feedbacks?locationId=${locationId}`,
        {
          content: newFeedback,
          rate: rating,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setFeedbacks([
          ...feedbacks,
          {
            id: Date.now(),
            text: newFeedback,
            author: username,
            date: new Date().toLocaleString(),
            rating,
          },
        ]);
        setNewFeedback("");
        setRating(0);

        return response.data;
      }
    } catch (error) {
      console.error("Помилка при відправці відгуку:", error);
      throw error;
    }
  }
  return null;
};

const getLocationRating = async (locationId) => {
  try {
    const response = await axios.get(`${BASE_URL}/locations/${locationId}`);
    return response.data;
  } catch (error) {
    console.error("Помилка при отриманні рейтингу:", error);
    throw error;
  }
};

const getFeedbacksByLocation = async (locationId) => {
  try {
    const response = await axios.get(`${BASE_URL}/feedbacks/location/${locationId}`);
    return response.data;
  } catch (error) {
    console.error("Помилка при отриманні відгуків:", error);
    throw error;
  }
};

const updateLocationTags = async (locationId, tags, token) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/locations/${locationId}`,
      {
        tags: tags,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Помилка при оновленні тегів закладу:", error);
    throw new Error("Не вдалося оновити теги закладу");
  }
};

export { handleAddFeedback, getFeedbacksByLocation, updateLocationTags, getLocationRating };
