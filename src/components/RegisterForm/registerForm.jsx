import { ErrorMessage, Formik, Field } from "formik";
import React, { useState } from "react";
import { ButtonSubmit, ErrorText, FormContainer, FormWrapper, Input, TitleForm } from "../../shared/forms.styled";
import * as yup from "yup";
import ConfirmForm from "../ConfirmForm/confirm";
import { registerUser } from "../../services/register";
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";
import { CheckboxLabel, DocCheckbox, DocWrapper, FileInput, FileInputWrapper } from "./registerForm.styled";

const SUPPORTED_FORMATS = ["application/pdf", "image/jpeg", "image/png"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const schema = yup.object().shape({
  email: yup.string().email("Введіть коректний email").required("Email обов’язковий"),
  name: yup.string().required("Ім’я обов’язкове"),
  password: yup
    .string()
    .min(6, "Пароль має бути не менше 6 символів")
    .max(16, "Пароль має бути не більше 16 символів")
    .required("Пароль обов’язковий"),
  repeatPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Паролі мають збігатися")
    .required("Повторний пароль обов’язковий"),
  isDisabled: yup.boolean(),
  disabilityFile: yup
    .mixed()
    .nullable()
    .test("file-required-if-disabled", "Файл обов’язковий при виборі інвалідності", function (value) {
      const { isDisabled } = this.parent;
      if (isDisabled) {
        return value instanceof File;
      }
      return true;
    })
    .test("file-format", "Тільки .pdf, .jpg, .jpeg, .png", function (value) {
      const { isDisabled } = this.parent;
      if (isDisabled && value) {
        return SUPPORTED_FORMATS.includes(value.type);
      }
      return true;
    })
    .test("file-size", "Файл має бути менше 5MB", function (value) {
      const { isDisabled } = this.parent;
      if (isDisabled && value) {
        return value.size <= MAX_FILE_SIZE;
      }
      return true;
    }),
});

const FormError = ({ name }) => {
  return <ErrorMessage name={name} render={(message) => <ErrorText>{message}</ErrorText>} />;
};

FormError.propTypes = {
  name: PropTypes.string.isRequired,
};

const RegisterForm = () => {
  const [approve, setApprove] = useState(false);
  const [isFileSelected, setIsFileSelected] = useState(false);

  return (
    <>
      {approve ? (
        <ConfirmForm type={"register"} />
      ) : (
        <FormWrapper marginTop="100px" marginTopMedium="50px" marginTopExtraSmall="40px">
          <TitleForm>Вітаємо на нашому сайті</TitleForm>
          <Formik
            initialValues={{
              email: "",
              name: "",
              password: "",
              repeatPassword: "",
              isDisabled: false,
              disabilityFile: null,
            }}
            onSubmit={async (values) => {
              try {
                localStorage.setItem("email", values.email);

                await registerUser({
                  email: values.email,
                  username: values.name,
                  password: values.password,
                  file: values.disabilityFile,
                  isDisabled: values.isDisabled,
                });

                setApprove(true);
              } catch (error) {
                alert("Щось пішло не так. Перевірте введені дані.");
                console.error(error);
              }
            }}
            validationSchema={schema}
          >
            {({ isValid, setFieldValue, values, touched }) => (
              <FormContainer>
                <Input
                  name="email"
                  placeholder="Емейл "
                  aria-label="Емейл"
                  aria-required="true"
                  data-tooltip-id="email-tooltip"
                />
                <Tooltip
                  id="email-tooltip"
                  content="Введіть дійсну електронну пошту для підтвердження облікового запису"
                />
                <FormError name="email" />
                <Input
                  name="name"
                  placeholder="Ім’я користувача"
                  aria-label="Ім’я користувача"
                  aria-required="true"
                  data-tooltip-id="name-tooltip"
                />
                <Tooltip id="name-tooltip" content="Введіть ваше ім'я для ідентифікації в системі" />
                <FormError name="name" />
                <Input
                  name="password"
                  placeholder="Пароль"
                  type="password"
                  aria-label="Пароль"
                  data-tooltip-id="password-tooltip"
                  aria-required="true"
                />
                <Tooltip id="password-tooltip" content="Придумайте пароль (6-16 символів)" />
                <FormError name="password" />
                <Input
                  name="repeatPassword"
                  placeholder="Повторіть пароль "
                  type="password"
                  aria-label="Повторіть пароль"
                  aria-required="true"
                  data-tooltip-id="repeat-password-tooltip"
                />
                <Tooltip id="repeat-password-tooltip" content="Повторіть пароль для підтвердження" />
                <FormError name="repeatPassword" />

                <DocWrapper>
                  <CheckboxLabel data-tooltip-id="disabled-tooltip">
                    <DocCheckbox type="checkbox" name="isDisabled" />
                    Прикріпіть документ про інвалідність
                  </CheckboxLabel>
                  <Tooltip id="disabled-tooltip" content="Є документ про інвалідність?" place="top" />

                  {values.isDisabled && (
                    <FileInputWrapper>
                      <FileInput
                        type="file"
                        name="disabilityFile"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(event) => {
                          const file = event.currentTarget.files[0];
                          setFieldValue("disabilityFile", file);
                          setIsFileSelected(!!file);
                        }}
                        isSelected={isFileSelected}
                      />
                      <FormError name="disabilityFile" />
                    </FileInputWrapper>
                  )}
               </DocWrapper>

                <ButtonSubmit
                  type="submit"
                  data-tooltip-id="register-button-tooltip"
                  disabled={!isValid || Object.keys(touched).length === 0}
                  aria-disabled={!isValid || Object.keys(touched).length === 0 ? "true" : "false"}
                >
                  Зареєструватися
                </ButtonSubmit>
                <Tooltip
                  id="register-button-tooltip"
                  content={!isValid ? "Заповніть всі поля форми коректно" : "Натисніть для реєстрації"}
                />
              </FormContainer>
            )}
          </Formik>
        </FormWrapper>
      )}
    </>
  );
};

export default RegisterForm;
