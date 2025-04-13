import React, { createContext, useContext, useState, useEffect } from "react";
import { loginConfirm } from "../services/login";
import { registerConfirm } from "../services/register";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.token) {
      setUser(storedUser);
      setIsLoggedIn(true);
    }
  }, []);

  const login = async (code) => {
    try {
      const response = await loginConfirm(code);
      const { token, user } = response;
      const userWithToken = { ...user, token };

      
      setUser(userWithToken);
      setIsLoggedIn(true);
      localStorage.setItem("user", JSON.stringify(userWithToken));
    } catch (error) {
      console.error("Помилка логіну:", error.message);
      throw error;
    }
  };

  const register = async (code) => {
    try {
      const response = await registerConfirm(code);
      const { token, user } = response;
      const userWithToken = { ...user, token };
      setUser(userWithToken);
      setIsLoggedIn(true);
      localStorage.setItem("user", JSON.stringify(userWithToken));
    } catch (error) {
      console.error("Помилка реєстрації:", error.message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setUser(null);
    setIsLoggedIn(false);
  };

  return <AuthContext.Provider value={{ user, isLoggedIn, login, register, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
