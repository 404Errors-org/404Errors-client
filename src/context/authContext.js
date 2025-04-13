import React, { createContext, useContext, useState, useEffect } from "react";
import { loginConfirm } from "../services/login";
import { registerConfirm } from "../services/register";
import PropTypes from "prop-types";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setIsLoggedIn(true);
    }
  }, []);

  const login = async (code) => {
    try {
      const response = await loginConfirm(code);
      const { user } = response;
      setUser(user);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Помилка логіну:", error.message);
      throw error;
    }
  };

  const register = async (code) => {
    try {
      const response = await registerConfirm(code);
      const { user } = response;
      setUser(user);
      setIsLoggedIn(true);
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

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  return useContext(AuthContext);
};
