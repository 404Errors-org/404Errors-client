import styled from "@emotion/styled";

export const Modal = styled.div`
  position: absolute;
  width: 580px;
  top: 90px;
  left: 20px;
  background-color: ${(props) => props.theme.colors.white};
  padding: 24px 16px;
  border-radius: 12px;
  z-index: 999;
`;

export const ModalTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  max-width: 365px;
  color: ${(props) => props.theme.colors.primaryDark};
  display: flex;
  align-items: center;
  margin-top: ${(props) => props.marginTop || "0"};
`;

export const CloseBtn = styled.button`
  border: none;
  width: 15px;
  height: 15px;
  background: url("./icons/close.svg");
  background-repeat: no-repeat;
  background-size: contain;
  cursor: pointer;
`;

export const HeadWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

export const LocationList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 2fr);
  row-gap: 12px;
  column-gap: 52px;
  margin-top: 18px;
`;

export const Checkbox = styled.input`
  display: none;
  width: 18px;
  height: 18px;
  margin-right: 30px;
  &:checked + span::before {
    transform: translate(-50%, -50%) scale(1);
  }
`;

export const Label = styled.label`
  display: flex;
  align-items: center;
  img {
    margin-right: 8px;
  }
`;

export const CustomCheckbox = styled.span`
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid ${(props) => props.theme.colors.primaryDark};
  border-radius: 4px;
  margin-right: 30px;
  position: relative;
  cursor: pointer;
  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 13px;
    height: 13px;
    background-color: ${(props) => props.theme.colors.primaryDark};
    transform: translate(-50%, -50%) scale(0);
    transition: transform 0.2s ease;
    border-radius: 2px;
  }
`;

export const StarContainer = styled.div` 
  display: flex; 
  justify-content: center; /* Центруємо зірки по горизонталі */ 
  gap: 5px; /* Відступ між зірками */ 
  margin: 10px 0; /* Відступи зверху та знизу */ 
`;