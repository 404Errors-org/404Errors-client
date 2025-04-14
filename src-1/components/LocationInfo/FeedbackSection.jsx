import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  FeedbacksSection,
  FeedbackForm,
  FeedbackInput,
  FeedbackButton,
  FeedbackItem,
  FeedbackAuthor,
  FeedbackText,
  FeedbackRating,
  StarContainer,
} from "./locationInfo.styled";
import { handleAddFeedback } from "../../services/feedback";

const FeedbackSection = ({ feedbacks, user, onFeedbackSubmit }) => {
  const [newFeedback, setNewFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const isFeedbackDisabled = feedbacks.some(
    (feedback) => feedback.author === user?.username || (feedback.user && feedback.user.id === user.id)
  );

  const handleAddFeedbackWithErrorHandling = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("Будь ласка, увійдіть до системи, щоб залишити відгук");
      return;
    }

    if (!newFeedback.trim() || !rating) {
      setError("Будь ласка, введіть відгук та оцінку");
      return;
    }

    try {
      setLoading(true);
      await handleAddFeedback(newFeedback, rating, user);
      setNewFeedback("");
      setRating(0);
      onFeedbackSubmit();
      setError(null);
    } catch (err) {
      setError("Не вдалося додати відгук. Спробуйте ще раз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FeedbacksSection>
      <h2>Відгуки:</h2>
      <div style={{ maxHeight: "200px", overflowY: "auto", marginBottom: "15px" }}>
        {feedbacks.length > 0 ? (
          feedbacks.map((feedback) => (
            <FeedbackItem key={feedback.id}>
              <FeedbackAuthor>
                {feedback.author || (feedback.user && feedback.user.username)}
              </FeedbackAuthor>
              <FeedbackText>{feedback.content}</FeedbackText>
              <FeedbackRating>Оцінка: {feedback.rate} з 5</FeedbackRating>
              <small>{feedback.date}</small>
            </FeedbackItem>
          ))
        ) : (
          <div style={{ textAlign: "center", padding: "10px" }}>
            <p>Ще немає відгуків. Будьте першим!</p>
          </div>
        )}
      </div>

      {!user ? (
        <div style={{ textAlign: "center", padding: "10px", margin: "10px 0", backgroundColor: "#f8f9fa", borderRadius: "5px" }}>
          <p style={{ color: "#666" }}>Увійдіть, щоб переглядати та залишати відгуки</p>
        </div>
      ) : (
        <FeedbackForm onSubmit={handleAddFeedbackWithErrorHandling}>
          <FeedbackInput
            value={newFeedback}
            onChange={(e) => setNewFeedback(e.target.value)}
            placeholder={isFeedbackDisabled ? "Ви вже додали відгук" : "Залишити відгук..."}
            required
            disabled={isFeedbackDisabled || loading}
          />

          <StarContainer>
            <span>Оцінка:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                style={{
                  cursor: loading ? "default" : "pointer",
                  color: star <= rating ? "gold" : "gray",
                  opacity: loading ? 0.6 : 1,
                }}
                onClick={() => !loading && setRating(star)}
              >
                ★
              </span>
            ))}
          </StarContainer>

          <FeedbackButton
            type="submit"
            disabled={isFeedbackDisabled || loading}
            style={{
              backgroundColor: isFeedbackDisabled ? "#28a745" : loading ? "#ccc" : "#007bff",
              cursor: isFeedbackDisabled || loading ? "not-allowed" : "pointer",
            }}
          >
            {isFeedbackDisabled ? "Відгук додано" : loading ? "Надсилання..." : "Додати відгук"}
          </FeedbackButton>
        </FeedbackForm>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </FeedbacksSection>
  );
};

FeedbackSection.propTypes = {
  feedbacks: PropTypes.array.isRequired,
  user: PropTypes.object,
  onFeedbackSubmit: PropTypes.func.isRequired,
};

export default FeedbackSection;