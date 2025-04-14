import styled from "@emotion/styled";
import { Field, Form } from "formik";
import { device } from "../constans/breakpoints";

export const FormContainer = styled(Form)`
  display: flex;
  flex-direction: column;
  width: 345px;
  margin-top: 30px;

  @media ${device.small} {
    margin-top: 20px;
  }

  @media ${device.extraSmall} {
    width: 280px;
  }
`;

export const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: ${(props) => props.marginTop};

  @media ${device.large} {
    margin-top: ${(props) => props.marginTopMedium};
  }

  @media ${device.extraSmall} {
    margin-top: ${(props) => props.marginTopExtraSmall};
  }
`;

export const Input = styled(Field)`
  padding: 8px 12px;
  margin-bottom: 12px;
  border: 1px solid ${(props) => props.theme.colors.primaryLight};
  border-radius: 8px;
  font-size: 16px;
  font-weight: 400;

  @media ${device.small} {
    font-size: 14px;
    padding: 6px 10px;
    margin-bottom: 8px;
  }
`;

export const ButtonSubmit = styled.button`
  padding-block: 12px;
  border-radius: 12px;
  border: none;
  background-color: ${(props) =>
    props.disabled ? props.theme.colors.buttonUnactive : props.theme.colors.primaryLight};
  font-size: 18px;
  font-weight: 600;
  color: ${(props) => (props.disabled ? props.theme.colors.buttonTextUnactive : props.theme.colors.white)};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  margin-bottom: 12px;

  @media ${device.medium} {
    font-size: 16px;
  }

  @media ${device.small} {
    font-size: 14px;
    padding-block: 10px;
    margin-bottom: 8px;
  }
`;

export const TitleForm = styled.h2`
  font-size: 32px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.black};

  @media ${device.medium} {
    font-size: 28px;
  }

  @media ${device.extraSmall} {
    font-size: 22px;
  }
`;

export const ErrorText = styled.p`
  font-size: 14px;
  font-weight: 400;
  color: ${(props) => props.theme.colors.primaryDark};
  margin-bottom: 5px;
  color: #ff0000;

  @media ${device.medium} {
    font-size: 12px;
  }
`;
