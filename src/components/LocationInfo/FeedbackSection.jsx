import React, { useState, useEffect } from "react";
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
  InfoTitle,
} from "./locationInfo.styled";
import { StarContainer } from "../LocationModal/locationModal.styled";
import { getFeedbacksByLocation, handleAddFeedback } from "../../services/feedback";

const FeedbackSection = ({ Info, user }) => {
  const [loading, setLoading] = useState(false);
  const [feedbacksLoading, setFeedbacksLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState([]);
  const [newFeedback, setNewFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [error, setError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [userFeedback, setUserFeedback] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchFeedbacks = async () => {
      if (!Info?.id) return;

      setFeedbacksLoading(true);

      try {
        const feedbackData = await getFeedbacksByLocation(Info.id, user?.token || null, controller.signal);

        if (!isMounted) return;

        setFeedbacks(feedbackData);

        if (user && Array.isArray(feedbackData)) {
          const userLeftFeedback = feedbackData.find((feedback) => feedback.user && feedback.user.id === user.id);

          if (userLeftFeedback) {
            setUserFeedback(userLeftFeedback);
          } else {
            setUserFeedback(null);
          }
        }

        setError(null);
      } catch (error) {
        if (!isMounted || error.name === "AbortError") return;

        setError("Помилка при завантаженні відгуків: " + error.message);
      } finally {
        if (isMounted) {
          setFeedbacksLoading(false);
        }
      }
    };

    fetchFeedbacks();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [Info?.id, user, submitSuccess]);

  const isFeedbackDisabled =
    userFeedback !== null ||
    feedbacks.some((feedback) => feedback.author === user?.username || (feedback.user && feedback.user.id === user.id));

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
      if (!Info?.id) {
        throw new Error("ID локації відсутній");
      }

      await handleAddFeedback(
        e,
        user,
        feedbacks,
        setFeedbacks,
        setNewFeedback,
        setRating,
        rating,
        newFeedback,
        Info.id
      );

      setError(null);
      setSubmitSuccess(true);

      const newUserFeedback = {
        id: Date.now().toString(),
        content: newFeedback,
        rate: rating,
        user: {
          id: user.id,
          username: user.username,
        },
        author: user.username,
        date: new Date().toLocaleString(),
      };
      setUserFeedback(newUserFeedback);
    } catch (err) {
      if (
        err.response &&
        err.response.data &&
        err.response.data.message === "User already submitted feedback for this location"
      ) {
        setError("Ви вже додали відгук для цього закладу");
        const userFeedback = {
          id: Date.now(),
          author: user.username,
          content: newFeedback,
          rate: rating,
          date: new Date().toLocaleString(),
          user: {
            id: user.id,
            username: user.username,
          },
        };
        setFeedbacks((prev) => [...prev, userFeedback]);
        setUserFeedback(userFeedback);
      } else {
        setError("Не вдалося додати відгук. Спробуйте ще раз.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <FeedbacksSection>
      <InfoTitle>Відгуки:</InfoTitle>
      <div style={{ maxHeight: "200px", overflowY: "auto", marginBottom: "15px" }}>
        {feedbacksLoading ? (
          <div style={{ textAlign: "center", padding: "10px" }}>
            <p>Завантаження відгуків...</p>
          </div>
        ) : feedbacks.length > 0 ? (
          feedbacks.map((feedback) => (
            <FeedbackItem key={feedback.id}>
              <FeedbackAuthor>
                {feedback.author || (feedback.user && feedback.user.username)}
                {user && (feedback.author === user.username || (feedback.user && feedback.user.id === user.id)) && (
                  <span style={{ color: "#007bff", marginLeft: "5px", fontSize: "0.8rem" }}>(Ваш відгук)</span>
                )}
              </FeedbackAuthor>
              <FeedbackText>{feedback.content}</FeedbackText>
              <FeedbackRating>Оцінка: {feedback.rate} з 5</FeedbackRating>
              <small>{feedback.date}</small>
            </FeedbackItem>
          ))
        ) : (
          <div style={{ textAlign: "center", padding: "10px" }}>
            <p>{user && "Ще немає відгуків. Будьте першим!"}</p>
          </div>
        )}
      </div>

      {!user ? (
        <div
          style={{
            textAlign: "center",
            padding: "10px",
            margin: "10px 0",
            backgroundColor: "#f8f9fa",
            borderRadius: "5px",
          }}
        >
          <p style={{ color: "#666" }}>Увійдіть, щоб залишити відгук</p>
        </div>
      ) : (
        <FeedbackForm onSubmit={handleAddFeedbackWithErrorHandling} aria-live="polite">
          {error && <div style={{ color: "#dc3545", marginBottom: "10px", fontSize: "0.9rem" }}>{error}</div>}
          <FeedbackInput
            value={newFeedback}
            onChange={(e) => setNewFeedback(e.target.value)}
            placeholder={isFeedbackDisabled ? "Ви вже додали відгук" : "Залишити відгук..."}
            required
            disabled={isFeedbackDisabled || loading}
            aria-label="Введіть ваш відгук"
          />

          {!isFeedbackDisabled && (
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
                  aria-label={`Оцінка ${star} з 5`}
                >
                  ★
                </span>
              ))}
            </StarContainer>
          )}

          <FeedbackButton
            type="submit"
            disabled={isFeedbackDisabled || loading}
            isDisabled={isFeedbackDisabled}
            isLoading={loading}
          >
            {isFeedbackDisabled ? "Відгук додано" : loading ? "Надсилання..." : "Додати відгук"}
          </FeedbackButton>
        </FeedbackForm>
      )}
    </FeedbacksSection>
  );
};

FeedbackSection.propTypes = {
  Info: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
  user: PropTypes.object,
};

export default FeedbackSection;
