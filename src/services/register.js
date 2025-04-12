import axios from 'axios';

const BASE_URL = 'https://404errors-server-production.up.railway.app'

export const registerUser = async (userData) => {
    try {
      const formData = new FormData();
      formData.append('email', userData.email);
      formData.append('username', userData.username);
      formData.append('password', userData.password);
      formData.append('hasDisability', userData.isDisabled);
  
      if (userData.file) {
        formData.append('file', userData.file); 
      }
  
      const response = await axios.post(`${BASE_URL}/auth/registration`, formData, {
        headers: {

        },
      });
  
      console.log('Реєстрація успішна:', response.data);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error('Помилка реєстрації:', errorMessage);
      throw new Error(errorMessage);
    }
  };

export const registerConfirm = async (code) => {
  const requestData = {
    confirmationCode: code,
    email: localStorage.getItem('email'),
    forLogin: false
  };

  try {
    const response = await axios.post(`${BASE_URL}/auth/confirm-registration`, requestData);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return { token, user };
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Помилка підтвердження реєстрації:', errorMessage);
    throw new Error(errorMessage);
  }
};
