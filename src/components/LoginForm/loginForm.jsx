import { ErrorMessage, Formik } from "formik";
import React, { useState } from "react";
import { ButtonSubmit, ErrorText, FormContainer, FormWrapper, Input, TitleForm } from "../../shared/forms.styled";
import * as yup from "yup";
import { loginUser } from "../../services/login";
import ConfirmForm from "../ConfirmForm/confirm";

const FormError = ({ name }) => {
  return <ErrorMessage name={name} render={(messsage) => <ErrorText>{messsage}</ErrorText>} />;
};

const schema = yup.object().shape({
  login: yup.string().required("Логін обов'язковий"),
  password: yup
    .string()
    .min(6, "Пароль має бути не менше 6 символів")
    .max(16, "Пароль має бути не більше 16 символів")
    .required("Пароль обов'язковий"),
});

const LoginForm = () => {
  const [approve, setApprove] = useState(false);
  const [backendError, setBackendError] = useState("");

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
                setBackendError("");
                await loginUser({
                  email: values.login,
                  password: values.password,
                });
                localStorage.setItem("email", values.login);
                setApprove(true);
              } catch (err) {
                console.error(err);
                setBackendError("Невірний логін або пароль");
              }
            }}
            validationSchema={schema}
          >
            {({ isValid, touched }) => (
              <FormContainer>
                <Input
                  id="login"
                  name="login" 
                  placeholder="Емейл користувача"
                  aria-required="true"
                  aria-describedby="loginError"
                />
                <FormError name="login" />
                
                <Input
                  id="password"
                  name="password"
                  placeholder="Пароль"
                  type="password"
                  aria-required="true"
                  aria-describedby="passwordError"
                />
                <FormError name="password" />
                
                <ButtonSubmit 
                  type="submit" 
                  disabled={!isValid || Object.keys(touched).length === 0}
                  aria-label="Увійти"
                >
                  Увійти
                </ButtonSubmit>

                {backendError && (
                  <ErrorText id="loginError" aria-live="assertive">
                    {backendError}
                  </ErrorText>
                )}
              </FormContainer>
            )}
          </Formik>
        </FormWrapper>
      )}
    </>
  );
};

export default LoginForm;