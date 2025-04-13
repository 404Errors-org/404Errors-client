import React from "react";
import { HeaderContainer, LoginBtn, NavItem, Link, NavList, Wrapper } from "./header.styled";
import { useAuth } from "../../context/authContext";
import { Tooltip } from "react-tooltip";

const Header = ({ onLocationClick }) => {
  const { user, isLoggedIn, logout } = useAuth();
  return (
    <>
      <HeaderContainer>
        <Wrapper>
          <img src="/icons/logo.png" alt="logo" width={65} height={65} aria-label="Логотип компанії" />
          <Link data-tooltip-id="filters-tooltip" onClick={onLocationClick} marginLeft="50px" aria-label="Відкрити локації">
            Локації
            <Tooltip id="filters-tooltip" content="Виберіть фільтри для пошуку" place="bottom" />
          </Link>
        </Wrapper>
        <NavList>
          {isLoggedIn ? (
            <Link data-tooltip-id="logout-tooltip" onClick={logout} aria-label={`Вийти з аккаунта, ${user.username}`}>
              {user.username}
              <Tooltip id="logout-tooltip" content="Натисніть, щоб вийти з облікового запису" place="bottom" />
            </Link>
          ) : (
            <NavItem>
              <LoginBtn data-tooltip-id="header-login" to="/login" aria-label="Увійти до аккаунту">
                Увійти
              </LoginBtn>
              <Tooltip id="header-login" content="Увійти у свій обліковий запис" place="bottom" />
            </NavItem>
          )}
        </NavList>
      </HeaderContainer>
    </>
  );
};

export default Header;
