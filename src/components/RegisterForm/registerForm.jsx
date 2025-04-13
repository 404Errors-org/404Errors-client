import { ErrorMessage, Formik, Field } from "formik";
import React, { useState } from "react";
import { ButtonSubmit, ErrorText, FormContainer, FormWrapper, Input, TitleForm } from "../../shared/forms.styled";
import * as yup from "yup";
import ConfirmForm from "../ConfirmForm/confirm";
import { registerUser } from "../../services/register";
import { Tooltip } from "react-tooltip";

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

const RegisterForm = () => {
  const [approve, setApprove] = useState(false);
  const [isFileSelected, setIsFileSelected] = useState(false);

  return (
    <>
      {approve ? (
        <ConfirmForm type={"register"} />
      ) : (
        <FormWrapper marginTop="100px">
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
            {({ isValid, setFieldValue, values }) => (
              <FormContainer>
                <Input name="email" placeholder="Емейл " aria-label="Емейл" aria-required="true" data-tooltip-id="email-tooltip" />
                <Tooltip
                  id="email-tooltip"
                  content="Введіть дійсну електронну пошту для підтвердження облікового запису"
                />
                <FormError name="email" />
                <Input name="name" placeholder="Ім’я користувача" aria-label="Ім’я користувача" aria-required="true" data-tooltip-id="name-tooltip" />
                <Tooltip id="name-tooltip" content="Введіть ваше ім'я для ідентифікації в системі" />
                <FormError name="name" />
                <Input name="password" placeholder="Пароль" type="password" aria-label="Пароль" data-tooltip-id="password-tooltip" aria-required="true" />
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

                <div style={{ margin: "20px 0" }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      fontSize: "16px",
                      cursor: "pointer",
                    }}
                    aria-label="Прикріпіть документ про інвалідність"
                  >
                    <Field
                      type="checkbox"
                      name="isDisabled"
                      style={{
                        width: "20px",
                        height: "20px",
                        accentColor: "#007BFF",
                        cursor: "pointer",
                      }}
                      aria-checked={values.isDisabled ? "true" : "false"}
                      aria-labelledby="checkbox-label"
                    />
                    Прикріпіть документ про інвалідність
                  </label>

                  <Tooltip
                    id="disabled-tooltip"
                    content="Виберіть, якщо у вас є документ про інвалідність"
                    place="top"
                  />

                  {values.isDisabled && (
                    <div style={{ marginTop: "15px" }}>
                      <input
                        type="file"
                        name="disabilityFile"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(event) => {
                          const file = event.currentTarget.files[0];
                          setFieldValue("disabilityFile", file);
                          setIsFileSelected(!!file);
                        }}
                        style={{
                          fontSize: "16px",
                          padding: "8px",
                          borderRadius: "6px",
                          border: `1px solid ${isFileSelected ? "#00bcd4" : "#ccc"}`,
                        }}
                      />
                      <FormError name="disabilityFile" />
                    </div>
                  )}
                </div>

                <ButtonSubmit type="submit" disabled={!isValid} aria-disabled={!isValid}>
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
