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
            <img 
                  src="/icons/logo.png" 
                  alt="logo" 
                  width={65} 
                  height={65} 
                  aria-label="Логотип компанії" 
                />
                <Link 
                  onClick={onLocationClick} 
                  marginLeft='50px' 
                  aria-label="Відкрити локації" 
                >
                  Локації
                </Link>
            </Wrapper>
            <NavList>
                {isLoggedIn ? 
                    <Link 
                      onClick={logout} 
                      aria-label={`Вийти з аккаунта, ${user.username}`} 
                    >
                      {user.username}
                    </Link> :
                <NavItem>
                    <LoginBtn to='/login' aria-label="Увійти до аккаунту">
                        Увійти
                    </LoginBtn></NavItem>}
            </NavList>
        </HeaderContainer>

        {/* <Map /> */}
      </>
    )
}

export default Header;
