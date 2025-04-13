import React from "react";
import {
  CenterElement,
  ContainerBg,
  FormBox,
  HeadBox,
  LinkButton,
  OtherLink,
  WelcomeBox,
  WelcomeDescription,
  WelcomeText,
} from "./background.styled";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

const BackGround = ({ type, children }) => {
  return (
    <ContainerBg>
      <FormBox>
        <HeadBox>
          <NavLink to="/">
            <img src="/icons/logo.png" alt="logo" width={65} height={65}></img>
          </NavLink>
          {type === "login" ? (
            <OtherLink to="/registration">Створити профіль</OtherLink>
          ) : (
            <OtherLink to="/login">Увійти</OtherLink>
          )}
        </HeadBox>
        {children}
      </FormBox>
      {type === "login" ? (
        <WelcomeBox>
          <CenterElement>
            <WelcomeText>З поверненням!</WelcomeText>
            <WelcomeDescription>Введіть свої персональні дані і розпочніть подорож з нами</WelcomeDescription>
            <LinkButton to="/registration">Зареєструватися</LinkButton>
          </CenterElement>
        </WelcomeBox>
      ) : (
        <WelcomeBox>
          <CenterElement>
            <WelcomeText>Ласкаво просимо на наш сайт!</WelcomeText>
            <WelcomeDescription>
              Щоб залишатися на зв'язку з нами, увійдіть, використовуючи свої особисті дані
            </WelcomeDescription>
            <LinkButton to="/login">Увійти</LinkButton>
          </CenterElement>
        </WelcomeBox>
      )}
    </ContainerBg>
  );
};

BackGround.propTypes = {
  type: PropTypes.oneOf(["login", "registration"]).isRequired,
  children: PropTypes.node.isRequired,
};

export default BackGround;
