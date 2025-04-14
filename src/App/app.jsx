import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/home";
import Login from "../pages/login";
import Registration from "../pages/register";

const App = () => {
  useEffect(() => {
    const handleGlobalError = (event) => {
      event.preventDefault();
      console.error("Uncaught error:", event.error || event.message);
      return true;
    };

    window.addEventListener("error", handleGlobalError);
    window.addEventListener("unhandledrejection", (event) => {
      event.preventDefault();
      console.error("Unhandled Promise Rejection:", event.reason);
    });

    return () => {
      window.removeEventListener("error", handleGlobalError);
      window.removeEventListener("unhandledrejection", handleGlobalError);
    };
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registration" element={<Registration />} />
    </Routes>
  );
};

export default App;
