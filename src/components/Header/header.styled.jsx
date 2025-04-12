import styled from "@emotion/styled";
import { NavLink } from "react-router-dom";

export const HeaderContainer = styled.div`
    display: flex;
    height: 72px;
    background-color: ${props => props.theme.colors.white};
    padding-inline: 20px;
    align-items: center;
    justify-content: space-between;
`
export const NavList = styled.ul`
    list-style: none;
    display: flex;
`

export const NavItem = styled.li`
    &:not(:last-child){
        margin-right: 50px;
    }
`

export const Link = styled.a`
    color: ${props => props.theme.colors.primaryDark};
    font-size: 16px;
    font-weight: 600;
    margin-left: ${props => props.marginLeft || '0px'};
    cursor: pointer;
`

export const LoginBtn = styled(NavLink)`
    text-decoration: none;
    padding: 12px 23px;
    border-radius: 12px;
    color: ${props => props.theme.colors.white};
    font-size: 16px;
    font-weight: 600;
    background-color: ${props => props.theme.colors.primaryLight}; 
`

export const Wrapper = styled.div`
    display: flex;
    align-items: center;
`