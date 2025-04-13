import { ErrorMessage, Formik } from "formik";
import React from "react";
import { ButtonSubmit, ErrorText, FormContainer, FormWrapper, Input, TitleForm } from "../../shared/forms.styled";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";

const FormError = ({ name }) => {
  return <ErrorMessage name={name} render={(messsage) => <ErrorText>{messsage}</ErrorText>} />;
};

FormError.propTypes = {
  name: PropTypes.string.isRequired,
};

const schema = yup.object().shape({
  code: yup.string().required("Код обов'язковий").length(6, "Код повинен містити рівно 6 символів"),
});

const ConfirmForm = ({ type }) => {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    try {
      if (type === "login") {
        await login(values.code);
      } else if (type === "register") {
        await register(values.code);
      }
      navigate("/");
    } catch (error) {
      alert("Щось пішло не так. Перевірте введені дані.");
    } finally {
      setSubmitting(false);
      resetForm();
    }
  };
  return (
    <FormWrapper marginTop="140px">
      <TitleForm>Введіть код підтвердження</TitleForm>

      <Formik
        initialValues={{
          code: "",
        }}
        onSubmit={handleSubmit}
        validationSchema={schema}
      >
        {({ touched, values }) => (
          <FormContainer>
            <Input name="code" placeholder="Код з email" data-tooltip-id="code-tooltip" />
            <Tooltip id="code-tooltip" content="Введіть 6-значний код із листа" place="bottom" />
            <FormError name="code" />
            <ButtonSubmit
              type="submit"
              disabled={!values.code || values.code.length !== 6}
              data-tooltip-id="confirm-button-tooltip"
            >
              Підтвердити
            </ButtonSubmit>
            <Tooltip
              id="confirm-button-tooltip"
              content={
                !values.code || values.code.length !== 6
                  ? "Введіть 6-значний код для продовження"
                  : "Натисніть для підтвердження"
              }
              place="bottom"
            />
          </FormContainer>
        )}
      </Formik>
    </FormWrapper>
  );
};

ConfirmForm.propTypes = {
  type: PropTypes.oneOf(["login", "registration"]).isRequired,
};

export default ConfirmForm;
