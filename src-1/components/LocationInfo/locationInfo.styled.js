import styled from "styled-components";

export const Modal = styled.div`
  /* Modal styles */
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 20px;
  max-width: 600px;
  width: 100%;
`;

export const HeadWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ModalTitle = styled.h2`
  font-size: 24px;
  margin: 0;
`;

export const CloseBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
`;

export const InfoTitle = styled.h3`
  font-size: 20px;
  margin: 10px 0;
`;

export const InfoDescription = styled.p`
  font-size: 16px;
  margin: 5px 0;
`;

export const AccessibilitySection = styled.section`
  margin: 20px 0;
`;

export const AccessibilityContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const AccessibilityItem = styled.div`
  display: flex;
  align-items: center;
  margin: 5px 0;
`;

export const AccessibilityLabel = styled.label`
  margin-left: 10px;
`;

export const FeedbacksSection = styled.section`
  margin: 20px 0;
`;

export const FeedbackForm = styled.form`
  display: flex;
  flex-direction: column;
`;

export const FeedbackInput = styled.input`
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

export const FeedbackButton = styled.button`
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

export const FeedbackItem = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 10px;
  margin: 10px 0;
`;

export const FeedbackAuthor = styled.span`
  font-weight: bold;
`;

export const FeedbackText = styled.p`
  margin: 5px 0;
`;

export const FeedbackRating = styled.span`
  font-style: italic;
`;

export const StarContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

export const SuggestionSection = styled.div`
  margin: 20px 0;
`;

export const SuggestionModal = styled(Modal)`
  /* Additional styles for Suggestion Modal if needed */
`;