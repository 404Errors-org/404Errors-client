import React from "react";
import { HeaderContainer, NavItem, Link, NavList, Wrapper } from "./header.styled";
import Map from "../map/map";

const Header = ({ onLocationClick }) => {
  return (
    <>
      <HeaderContainer>
        <Wrapper>
          <img src="/icons/logo.png" alt="logo" width={65} height={65}></img>
          <Link onClick={onLocationClick} marginLeft="50px">
            Локації
          </Link>
        </Wrapper>
        <NavList>
          <NavItem>Увійти</NavItem>
        </NavList>
      </HeaderContainer>

      {/* <Map /> */}
    </>
  );
};

export default Header;
