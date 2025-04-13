import React, { useState, useEffect } from "react";
import {
  InfoDescription,
  InfoTitle,
  Modal,
  FeedbacksSection,
  FeedbackForm,
  FeedbackInput,
  FeedbackButton,
  FeedbackItem,
  FeedbackAuthor,
  FeedbackText,
  FeedbackRating,
  AccessibilitySection,
  AccessibilityContainer,
  AccessibilityItem,
  AccessibilityLabel,
  EditButton,
} from "./locationInfo.styled";
import { CloseBtn, HeadWrapper, ModalTitle, StarContainer } from "../LocationModal/locationModal.styled";
import { useAuth } from "../../context/authContext";
import { handleAddFeedback, getFeedbacksByLocation } from "../../services/feedback";
import { Tooltip } from "react-tooltip";
import { CustomCheckbox } from "../LocationModal/locationModal.styled";
import PropTypes from "prop-types";

const LocationInfo = ({ Info, onChangeInfo }) => {
  const infoVisible = () => onChangeInfo();
  const [loading, setLoading] = useState(false);
  const [feedbacksLoading, setFeedbacksLoading] = useState(true);
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [features, setFeatures] = useState(Info?.accessibilityFeatures || {});
  const [feedbacks, setFeedbacks] = useState([]);
  const [newFeedback, setNewFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [error, setError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const toggleFeature = (key) => {
    setFeatures((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  useEffect(() => {
    if (Info?.id) {
      setFeedbacksLoading(true);

      const fetchFeedbacks = async () => {
        try {
          if (user?.token) {
            const feedbackData = await getFeedbacksByLocation(Info.id, user.token);
            setFeedbacks(feedbackData);
            setError(null);
          }
        } catch (error) {
          setError("Помилка при завантаженні відгуків: " + error.message);
        } finally {
          setFeedbacksLoading(false);
        }
      };

      fetchFeedbacks();
    }
  }, [user?.token, Info?.id, submitSuccess]);

  const isFeedbackDisabled = feedbacks.some((feedback) => feedback.author === user?.username);

  const handleSave = () => {
    setEditing(false);
  };

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
        };
        setFeedbacks((prev) => [...prev, userFeedback]);
      } else {
        setError("Не вдалося додати відгук. Спробуйте ще раз.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal>
      <HeadWrapper>
        <ModalTitle>{Info?.name || "Location"}</ModalTitle>
        <CloseBtn onClick={infoVisible} />
      </HeadWrapper>

      {Info?.location || Info?.phone ? <InfoTitle>Адреса і контакти:</InfoTitle> : null}

      {Info?.location ? (
        <>
          <InfoDescription
            type="location"
            data-tooltip-id="location-tooltip"
            data-tooltip-content="Адреса розташування"
          >
            {Info.location}
          </InfoDescription>
          <Tooltip id="location-tooltip" />
        </>
      ) : null}

      {Info?.phone ? (
        <>
          <InfoDescription type="number" data-tooltip-id="phone-tooltip" data-tooltip-content="Контактний телефон">
            {Info.phone}
          </InfoDescription>
          <Tooltip id="phone-tooltip" place="top-start" />
        </>
      ) : null}

      <AccessibilitySection>
        <InfoTitle>Рейтинг доступності закладу:</InfoTitle>
        <AccessibilityContainer>
          <AccessibilityItem>
            <CustomCheckbox
              checked={features?.hasRamp || false}
              onChange={() => toggleFeature("hasRamp")}
              icon={`/icons/hasRamp.svg`}
              style={{ margin: "0" }}
            />
            <AccessibilityLabel>Пандуси</AccessibilityLabel>
          </AccessibilityItem>
          <AccessibilityItem>
            <CustomCheckbox
              checked={features?.hasToilet || false}
              onChange={() => toggleFeature("hasToilet")}
              icon={`/icons/hasToilet.svg`}
              style={{ margin: "0" }}
            />
            <AccessibilityLabel>Широкий вхід</AccessibilityLabel>
          </AccessibilityItem>
          <AccessibilityItem>
            <CustomCheckbox
              checked={features?.wheelchairAccessible || false}
              onChange={() => toggleFeature("wheelchairAccessible")}
              icon={`/icons/wheelchairAccessible.svg`}
              style={{ margin: "0" }}
            />
            <AccessibilityLabel>Туалети</AccessibilityLabel>
          </AccessibilityItem>
          <AccessibilityItem>
            <CustomCheckbox
              checked={features?.areBlind || false}
              onChange={() => toggleFeature("areBlind")}
              icon={`/icons/areBlind.svg`}
              style={{ margin: "0" }}
            />
            <AccessibilityLabel>Для незрячих людей</AccessibilityLabel>
          </AccessibilityItem>
          <AccessibilityItem>
            <CustomCheckbox
              checked={features?.freetomove || false}
              onChange={() => toggleFeature("freetomove")}
              icon={`/icons/freetomove.svg`}
              style={{ margin: "0" }}
            />
            <AccessibilityLabel>Вільне пересування</AccessibilityLabel>
          </AccessibilityItem>
        </AccessibilityContainer>
      </AccessibilitySection>

      {editing && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <button type="submit">Зберегти</button>
        </form>
      )}

      {user?.hasDisability && !editing && (
        <EditButton onClick={() => setEditing(true)}>Редагувати доступність</EditButton>
      )}

      <FeedbacksSection>
        <InfoTitle> {user && <p>Відгуки: (можна залишити лише один відгук)</p>}</InfoTitle>
        <div style={{ maxHeight: "200px", overflowY: "auto", marginBottom: "15px" }}>
          {feedbacksLoading ? (
            <div style={{ textAlign: "center", padding: "10px" }}>
              <p>Завантаження відгуків...</p>
            </div>
          ) : feedbacks.length > 0 ? (
            feedbacks.map((feedback) => (
              <FeedbackItem key={feedback.id}>
                <FeedbackAuthor>
                  {feedback.author}
                  {feedback.author === user?.username && (
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
              {user && <p>Ще немає відгуків. Будьте першим!</p>}
            </div>
          )}
        </div>

        {error && (
          <div
            style={{
              color: "white",
              backgroundColor: "#ff5252",
              padding: "10px",
              borderRadius: "5px",
              marginBottom: "15px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        {!user ? (
          <div style={{ textAlign: "center", padding: "10px", color: "#666" }}>
            <p>Увійдіть, щоб залишити відгук</p>
          </div>
        ) : (
          <FeedbackForm onSubmit={handleAddFeedbackWithErrorHandling}>
            {isFeedbackDisabled && (
              <div
                style={{
                  backgroundColor: "#f8f9fa",
                  padding: "10px",
                  borderRadius: "5px",
                  marginBottom: "10px",
                  textAlign: "center",
                  color: "#666",
                }}
              >
                <p>Ви вже додали відгук для цього закладу</p>
              </div>
            )}

            <FeedbackInput
              value={newFeedback}
              onChange={(e) => setNewFeedback(e.target.value)}
              placeholder={isFeedbackDisabled ? "Ви вже додали відгук" : "Залишити відгук..."}
              required
              disabled={isFeedbackDisabled || loading}
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
                  >
                    ★
                  </span>
                ))}
              </StarContainer>
            )}

            <FeedbackButton
              type="submit"
              disabled={isFeedbackDisabled || loading}
              style={{
                backgroundColor: isFeedbackDisabled ? "gray" : loading ? "#ccc" : "#007bff",
                cursor: isFeedbackDisabled || loading ? "not-allowed" : "pointer",
              }}
            >
              {isFeedbackDisabled ? "Відгук додано" : loading ? "Надсилання..." : "Додати відгук"}
            </FeedbackButton>
          </FeedbackForm>
        )}
      </FeedbacksSection>
    </Modal>
  );
};

LocationInfo.propTypes = {
  Info: PropTypes.shape({
    name: PropTypes.string.isRequired,
    location: PropTypes.string,
    phone: PropTypes.string,
    website: PropTypes.string,
    id: PropTypes.string.isRequired,
    accessibilityFeatures: PropTypes.object,
  }).isRequired,
  onChangeInfo: PropTypes.func.isRequired,
};

export default LocationInfo;
