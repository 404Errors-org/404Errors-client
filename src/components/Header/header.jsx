import React from "react";
import { HeaderContainer, LoginBtn, NavItem, Link, NavList, Wrapper } from "./header.styled";
import Map from "../map/map";


const Header = ({onLocationClick, selectedCategories }) => {

    return(
      <>
        <HeaderContainer>
            <Wrapper>
                <img src="/icons/logo.png" alt="logo" width={65} height={65}></img>
                <Link onClick={onLocationClick} marginLeft='50px'>Локації</Link>
            </Wrapper>
            <NavList>
                <NavItem>Увійти</NavItem> 
            </NavList>
        </HeaderContainer>

        <Map selectedCategories={selectedCategories} />

      </>
    )
}

export default Header;
