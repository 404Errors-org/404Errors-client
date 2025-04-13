import styled from "@emotion/styled";
import { Link, NavLink } from "react-router-dom";

export const ContainerBg = styled.div`
    display: flex;
    width: 100%;
    height: 100vh;
`

export const FormBox = styled.div`
    width: 60%;
`

export const HeadBox = styled.div`
    display: flex;
    height: 72px;
    justify-content: space-between;
    align-items: center;
    padding-inline: 20px;
`

export const OtherLink = styled(NavLink)`
    text-decoration: none;
    color: ${props => props.theme.colors.primaryDark};
    font-size: 14px;
    font-weight: 400;
`

export const WelcomeBox = styled.div`
    width: 40%;
    display: flex;
    align-items: center;
    background-color: #E5F5F6;
    background-image: url('/images/formbg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
`

export const WelcomeText = styled.h2`
    width: 425px;
    font-size: 36px;
    font-weight: 700;
    color: #026C6C;
    text-align: center;
`

export const WelcomeDescription = styled.p`
    width: 440px;
    font-size: 20px;
    font-weight: 400;
    color: #026C6C;
    text-align: center;
    margin-top: 30px;
    line-height: 1.6em;
`

export const CenterElement = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

export const LinkButton = styled(Link)`
    display: inline-block;
    padding: 12px 47px;
    border: 1px solid #026C6C;
    border-radius: 13px;
    background-color: transparent;
    font-size: 16px;
    font-weight: 700;
    color: #026C6C;
    cursor: pointer;
    text-decoration: none;
    margin-top: 30px;
`