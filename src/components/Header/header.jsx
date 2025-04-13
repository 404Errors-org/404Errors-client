import React from "react";
import { HeaderContainer, LoginBtn, NavItem, Link, NavList, Wrapper } from "./header.styled";
import Map from "../map/map";
import { useAuth } from "../../context/authContext";

const Header = ({ onLocationClick }) => {
    const { user, isLoggedIn, logout } = useAuth();
    return(
      <>
        <HeaderContainer>
            <Wrapper>
                <img src="/icons/logo.png" alt="logo" width={65} height={65}></img>
                <Link onClick={onLocationClick} marginLeft='50px'>Локації</Link>
            </Wrapper>
            <NavList>
                {isLoggedIn ? <Link onClick={logout}>{user.username}</Link> :
                <NavItem><LoginBtn to='/login'>Увійти</LoginBtn></NavItem>}
            </NavList>
        </HeaderContainer>

        {/* <Map /> */}
      </>
    )
}

export default Header;
