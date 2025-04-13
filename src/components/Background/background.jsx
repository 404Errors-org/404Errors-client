import React from "react";
import { CenterElement, ContainerBg, FormBox, HeadBox, LinkButton, OtherLink, WelcomeBox, WelcomeDescription, WelcomeText } from "./background.styled";
import { NavLink } from "react-router-dom";

const BackGround = ({type, children}) => {
    return(
        <ContainerBg>
            <FormBox role="form" aria-labelledby="form-title">
                <HeadBox>
                    <NavLink aria-label="Повернутися на головну" to='/'><img src="/icons/logo.png" alt="logo" width={65} height={65}></img></NavLink>
                    {type === 'login' ? 
                    (<OtherLink to='/registration' aria-label="Перейти до сторінки реєстрації">Створити профіль</OtherLink>) : 
                    (<OtherLink to='/login' aria-label="Перейти до сторінки входу">Увійти</OtherLink>)}
                </HeadBox>
                {children}
            </FormBox>
            {type === 'login' ?
            <WelcomeBox role="region" aria-labelledby="welcome-title">
                <CenterElement>
                    <WelcomeText id="welcome-title">З поверненням!</WelcomeText>
                    <WelcomeDescription>Введіть свої персональні дані і розпочніть подорож з нами</WelcomeDescription>
                    <LinkButton to='/registration'>Зареєструватися</LinkButton>
                </CenterElement>
            </WelcomeBox> :
            <WelcomeBox>
                <CenterElement>
                    <WelcomeText>Ласкаво просимо на наш сайт!</WelcomeText>
                    <WelcomeDescription>Щоб залишатися на зв'язку з нами, увійдіть, використовуючи свої особисті дані</WelcomeDescription>
                    <LinkButton to='/login'>Увійти</LinkButton>
                </CenterElement>
            </WelcomeBox>}
            
        </ContainerBg>
    )
}

export default BackGround