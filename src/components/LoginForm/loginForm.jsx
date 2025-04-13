import { ErrorMessage, Formik } from "formik";
import React, { useState } from "react";
import {
  ButtonSubmit,
  ErrorText,
  ForgotPassword,
  FormContainer,
  FormWrapper,
  Input,
  TitleForm,
} from "../../shared/forms.styled";
import * as yup from "yup";
import { loginUser } from "../../services/login";
import ConfirmForm from "../ConfirmForm/confirm";
import PropTypes from "prop-types";

const FormError = ({ name }) => {
  return <ErrorMessage name={name} render={(messsage) => <ErrorText>{messsage}</ErrorText>} />;
};

FormError.propTypes = {
  name: PropTypes.string.isRequired,
};

const schema = yup.object().shape({
  login: yup.string().required("Логін обов’язковий"),
  password: yup
    .string()
    .min(6, "Пароль має бути не менше 6 символів")
    .max(16, "Пароль має бути не більше 16 символів")
    .required("Пароль обов’язковий"),
});

const LoginForm = () => {
  const [approve, setApprove] = useState(false);
  return (
    <>
      {approve ? (
        <ConfirmForm type={"login"} />
      ) : (
        <FormWrapper marginTop="140px">
          <TitleForm>Вітаємо з поверненням</TitleForm>
          <Formik
            initialValues={{
              login: "",
              password: "",
            }}
            onSubmit={async (values) => {
              try {
                await loginUser({
                  email: values.login,
                  password: values.password,
                });
                localStorage.setItem("email", values.login);
                setApprove(true);
              } catch (err) {
                alert("Щось пішло не так. Перевірте введені дані.");
                console.error(err);
              }
            }}
            validationSchema={schema}
          >
            {({ isValid, touched }) => (
              <FormContainer>
                <Input name="login" placeholder="Емейл користувача" />
                <FormError name="login" />
                <Input name="password" type="password" placeholder="Пароль" />
                <FormError name="password" />
                <ForgotPassword>Забули пароль?</ForgotPassword>
                <ButtonSubmit type="submit" disabled={!isValid || Object.keys(touched).length === 0}>
                  Увійти
                </ButtonSubmit>
              </FormContainer>
            )}
          </Formik>
        </FormWrapper>
      )}
    </>
  );
};

export default LoginForm;
