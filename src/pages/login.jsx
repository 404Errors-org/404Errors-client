import React from "react";
import BackGround from "../components/Background/background";
import LoginForm from "../components/LoginForm/loginForm";

const Login = () => {
  return (
    <BackGround type="login">
      <LoginForm />
    </BackGround>
  );
};

export default Login;
