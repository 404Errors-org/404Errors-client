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
  margin-bottom: 10px;
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

export const IconSave = styled.img`
  margin-left: 10px;
  cursor: pointer;
`;

export const FeedbacksSection = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
`;

export const FeedbackForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
`;

export const FeedbackInput = styled.input`
  flex-grow: 1;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

export const FeedbackButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: gray;
    cursor: not-allowed;
  }
`;

export const EditButton = styled.button`
  padding: 8px 16px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;

  &:hover {
    background-color: #218838;
  }
`;

export const FeedbackItem = styled.div`
  margin-bottom: 15px;
  padding: 10px;
  background: #f9f9f9;
  border-radius: 4px;
`;

export const FeedbackAuthor = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
`;

export const FeedbackText = styled.p`
  margin: 5px 0;
`;

export const AccessibilitySection = styled.div`
  margin: 20px 0;
  padding: 20px;
  background-color: #f8f9fa;
  flex-direction: row;
  border-radius: 8px;
`;

export const AccessibilityContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
`;

export const AccessibilityItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 14px;
`;

export const AccessibilityLabel = styled.span`
  font-size: 16px;
  padding-left: 5px;
`;

export const FeedbackRating = styled.div`
  font-size: 16px;
  color: gray;
  margin-top: 10px;
  span {
    cursor: pointer;
    margin-right: 5px;
    font-size: 20px;
  }
`;
