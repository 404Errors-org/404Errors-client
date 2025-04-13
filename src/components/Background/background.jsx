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
import { Tooltip } from "react-tooltip";

const BackGround = ({ type, children }) => {
  return (
    <ContainerBg>
      <FormBox>
        <HeadBox>
          <NavLink to="/" data-tooltip-id="logo-tooltip">
            <img src="/icons/logo.png" alt="logo" width={65} height={65}></img>
          </NavLink>
          <Tooltip id="logo-tooltip" content="Перейти на головну сторінку" place="bottom" />

          {type === "login" ? (
            <OtherLink to="/registration" data-tooltip-id="create-profile-tooltip">
              Створити профіль
            </OtherLink>
          ) : (
            <OtherLink to="/login" data-tooltip-id="login-tooltip">
              Увійти
            </OtherLink>
          )}

          {type === "login" ? (
            <Tooltip
              id="create-profile-tooltip"
              content="Зареєструйтесь, щоб отримати доступ до всіх функцій"
              place="bottom"
            />
          ) : (
            <Tooltip id="login-tooltip" content="Увійдіть у свій обліковий запис" place="bottom" />
          )}
        </HeadBox>
        {children}
      </FormBox>
      {type === "login" ? (
        <WelcomeBox>
          <CenterElement>
            <WelcomeText>З поверненням!</WelcomeText>

            <WelcomeDescription>Введіть свої персональні дані і розпочніть подорож з нами</WelcomeDescription>

            <LinkButton to="/registration" data-tooltip-id="register-tooltip">
              Зареєструватися
            </LinkButton>
            <Tooltip id="register-tooltip" content="Створити новий обліковий запис" place="bottom" />
          </CenterElement>
        </WelcomeBox>
      ) : (
        <WelcomeBox>
          <CenterElement>
            <WelcomeText>Ласкаво просимо на наш сайт!</WelcomeText>

            <WelcomeDescription>
              Щоб залишатися на зв'язку з нами, увійдіть, використовуючи свої особисті дані
            </WelcomeDescription>

            <LinkButton to="/login" data-tooltip-id="login-btn-tooltip">
              Увійти
            </LinkButton>
            <Tooltip id="login-btn-tooltip" content="Увійти в існуючий обліковий запис" place="bottom" />
          </CenterElement>
        </WelcomeBox>
      )}
    </ContainerBg>
  );
};

export default BackGround;
