import axios from "axios";

const BASE_URL = "https://404errors-server-production.up.railway.app";

export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, userData);
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Помилка логування:", errorMessage);
    throw new Error(errorMessage);
  }
};

export const loginConfirm = async (code) => {
  const requestData = {
    confirmationCode: code,
    email: localStorage.getItem("email"),
    forLogin: false,
  };
  try {
    const response = await axios.post(`${BASE_URL}/auth/confirm-login`, requestData);
    const { token, user } = response.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    return { token, user };
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Помилка логування:", errorMessage);
    throw new Error(errorMessage);
  }
};
