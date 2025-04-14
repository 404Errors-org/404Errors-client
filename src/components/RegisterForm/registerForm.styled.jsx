import styled from "@emotion/styled";
import { Field } from "formik";
import { device } from "../../constans/breakpoints";

export const DocWrapper = styled.div`
  margin-top: 10px;
  margin-bottom: 20px;
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  cursor: pointer;

  @media ${device.medium} {
    font-size: 14px;
  }
`;

export const DocCheckbox = styled(Field)`
  width: 20px;
  height: 20px;
  accent-color: #007bff;
  cursor: "pointer";

  @media ${device.medium} {
    width: 15px;
    height: 15px;
  }
`;

export const FileInputWrapper = styled.div`
  margin-top: 15px;
`;

export const FileInput = styled.input`
  font-size: 16px;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid ${({ isSelected }) => (isSelected ? "#00bcd4" : "#ccc")};

  @media ${device.medium} {
    font-size: 14px;
  }
`;
