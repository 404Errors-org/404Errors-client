import styled from "@emotion/styled";
import { Field, Form} from "formik";

export const FormContainer = styled(Form)`
    display: flex;
    flex-direction: column;
    width: 345px;
    margin-top: 30px;
`

export const FormWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: ${props => props.marginTop};
`

export const Input = styled(Field)`
    padding: 8px 12px;
    margin-bottom: 12px;
    border: 1px solid ${props => props.theme.colors.primaryLight};
    border-radius: 8px;
    font-size: 16px;
    font-weight: 400;
`

export const ButtonSubmit = styled.button`
    padding-block: 12px;
    border-radius: 12px;
    border: none;
    background-color: ${(props) =>
    props.disabled
      ? props.theme.colors.buttonUnactive
      : props.theme.colors.primaryLight};
    font-size: 18px;
    font-weight: 600;
    color: ${(props) =>
    props.disabled
      ? props.theme.colors.buttonTextUnactive
      : props.theme.colors.white};
    cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
`

export const TitleForm = styled.h2`
    font-size: 32px;
    font-weight: 700;
    color: ${props => props.theme.colors.black};
`

export const ForgotPassword = styled.a`
    font-size: 14px;
    font-weight: 400;
    color: ${props => props.theme.colors.primaryDark};
    text-align: end;
    margin-bottom: 12px;
    cursor: pointer;
`

export const ErorrText = styled.p`
    font-size: 14px;
    font-weight: 400;
    color: ${props => props.theme.colors.primaryDark};
    margin-bottom: 5px;
    color: #FF0000;
`