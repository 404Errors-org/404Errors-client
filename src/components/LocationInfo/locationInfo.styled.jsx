import styled from "@emotion/styled";

export const Modal = styled.div`
  position: absolute;
  width: 410px;
  top: 90px;
  left: 20px;
  background-color: ${(props) => props.theme.colors.white};
  padding: 24px 16px;
  border-radius: 12px;
  z-index: 999;
`;

export const InfoTitle = styled.p`
  font-size: 16px;
  font-weight: 400;
  color: ${(props) => props.theme.colors.primaryDark};
  margin-top: 10px;
`;

export const InfoDescription = styled.p`
  display: flex;
  font-size: 16px;
  font-weight: 400;
  color: ${(props) => props.theme.colors.gray};
  align-items: center;
  margin-top: 8px;
  &::before {
    display: inline-block;
    content: "";
    width: 19px;
    height: 19px;
    margin-right: 5px;
    background: ${(props) => {
      if (props.type === "location") {
        return `url('./icons/infolocation.svg')`;
      } else if (props.type === "number") {
        return `url('./icons/infonumber.svg')`;
      }
    }};
    background-repeat: no-repeat;
    background-size: contain;
  }
`;

export const Website = styled.a`
  display: flex;
  font-size: 16px;
  font-weight: 400;
  color: ${(props) => props.theme.colors.gray};
  align-items: center;
  margin-top: 8px;
  text-decoration: none;
  &::before {
    display: inline-block;
    content: "";
    width: 19px;
    height: 19px;
    margin-right: 5px;
    background: url("./icons/infosite.svg");
    background-repeat: no-repeat;
    background-size: contain;
  }
`;
