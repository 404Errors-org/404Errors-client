import React, { useState, useEffect } from "react";
import { 
  InfoDescription, 
  InfoTitle, 
  Modal, 
  Website, 
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
  EditButton
} from "./locationInfo.styled";
import { CloseBtn, HeadWrapper, ModalTitle, StarContainer } from "../LocationModal/locationModal.styled";
import { useAuth } from "../../context/authContext";
import { handleAddFeedback, getFeedbacksByLocation } from "../../services/feedback";
import { Tooltip } from "react-tooltip";
import { Checkbox, CustomCheckbox } from "../LocationModal/locationModal.styled";
import PropTypes from "prop-types";

const LocationInfo = ({ Info, onChangeInfo }) => {
    const infoVisible = () => onChangeInfo();
    const { user } = useAuth();
    const [editing, setEditing] = useState(false);
    const [features, setFeatures] = useState(Info.accessibilityFeatures || {});
    const [feedbacks, setFeedbacks] = useState([]);
    const [newFeedback, setNewFeedback] = useState('');
    const [rating, setRating] = useState(0);
    const [error, setError] = useState(null);

    const toggleFeature = (key) => {
        setFeatures((prev) => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    useEffect(() => {
        if (user?.token) {
            getFeedbacksByLocation(info.id, user.token)
                .then((feedbackData) => {
                    setFeedbacks(feedbackData);
                })
                .catch((error) => {
                    setError("Помилка при завантаженні відгуків: " + error.message);
                });
        } else {
            alert("Будь ласка, увійдіть, щоб переглядати відгуки.");
        }
    }, [user, info.id]);

    const isFeedbackDisabled = feedbacks.some(feedback => feedback.author === user?.username);

    const handleSave = () => {
        setEditing(false);
    };

    const handleAddFeedbackWithErrorHandling = async (e) => {
        e.preventDefault();

        try {
            await handleAddFeedback(e, user, feedbacks, setFeedbacks, setNewFeedback, setRating, rating, newFeedback, info.id);
            setError(null);
        } catch (err) {
            setError("Не вдалося додати відгук. Спробуйте ще раз.");
        }
    };

    return (
        <Modal>
      <HeadWrapper>
        <ModalTitle>{info.name}</ModalTitle>
        <CloseBtn onClick={infoVisible} />
      </HeadWrapper>

      {info.location || info.phone ? <InfoTitle>Адреса і контакти:</InfoTitle> : null}

      {info.location ? (
        <>
          <InfoDescription
            type="location"
            data-tooltip-id="location-tooltip"
            data-tooltip-content="Адреса розташування"
          >
            {info.location}
          </InfoDescription>
          <Tooltip id="location-tooltip" />
        </>
      ) : null}

      {info.phone ? (
        <>
          <InfoDescription type="number" data-tooltip-id="phone-tooltip" data-tooltip-content="Контактний телефон">
            {info.phone}
          </InfoDescription>
          <Tooltip id="phone-tooltip" place="top-start" />
        </>
      ) : null}

            <AccessibilitySection>
                <InfoTitle>Рейтинг доступності закладу:</InfoTitle>
                <AccessibilityContainer>
                    <AccessibilityItem>
                        <CustomCheckbox 
                            checked={features.hasRamp}
                            onChange={() => toggleFeature('hasRamp')}
                            icon={`/icons/hasRamp.svg`}
                        />
                        <AccessibilityLabel>Пандуси</AccessibilityLabel>
                    </AccessibilityItem>
                    <AccessibilityItem>
                        <CustomCheckbox 
                            checked={features.hasToilet}
                            onChange={() => toggleFeature('hasToilet')}
                            icon={`/icons/hasToilet.svg`}
                        />
                        <AccessibilityLabel>Широкий вхід</AccessibilityLabel>
                    </AccessibilityItem>
                    <AccessibilityItem>
                        <CustomCheckbox 
                            checked={features.wheelchairAccessible}
                            onChange={() => toggleFeature('wheelchairAccessible')}
                            icon={`/icons/wheelchairAccessible.svg`}
                        />
                        <AccessibilityLabel>Туалети</AccessibilityLabel>
                    </AccessibilityItem>
                    <AccessibilityItem>
                        <CustomCheckbox 
                            checked={features.areBlind}
                            onChange={() => toggleFeature('areBlind')}
                            icon={`/icons/areBlind.svg`}
                        />
                        <AccessibilityLabel>Для сліпих</AccessibilityLabel>
                    </AccessibilityItem>
                    <AccessibilityItem>
                        <CustomCheckbox 
                            checked={features.freetomove}
                            onChange={() => toggleFeature('freetomove')}
                            icon={`/icons/freetomove.svg`}
                        />
                        <AccessibilityLabel>Вільне пересування</AccessibilityLabel>
                    </AccessibilityItem>
                </AccessibilityContainer>
            </AccessibilitySection>

            {editing && (
                <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                    <button type="submit">Зберегти</button>
                </form>
            )}

            {user?.hasDisability && !editing && (
                <EditButton onClick={() => setEditing(true)}>
                    Редагувати доступність
                </EditButton>
            )}

            <FeedbacksSection>
                <InfoTitle>Відгуки:</InfoTitle>
                <div style={{ maxHeight: "100px", overflowY: "auto" }}>
                    {feedbacks.length > 0 ? (
                        feedbacks.map(feedback => (
                            <FeedbackItem key={feedback.id}>
                                <FeedbackAuthor>{feedback.author}</FeedbackAuthor>
                                <FeedbackText>{feedback.content}</FeedbackText>
                                <FeedbackRating>Оцінка: {feedback.rate} з 5</FeedbackRating>
                                <small>{feedback.date}</small>
                            </FeedbackItem>
                        ))
                    ) : (
                        <p>Ще немає відгуків. Будьте першим!</p>
                    )}
                </div>

                {error && <p style={{ color: 'red' }}>{error}</p>}

                <FeedbackForm onSubmit={handleAddFeedbackWithErrorHandling}>
                    <FeedbackInput
                        value={newFeedback}
                        onChange={(e) => setNewFeedback(e.target.value)}
                        placeholder="Залишити відгук..."
                        required
                        disabled={isFeedbackDisabled}  
                    />
                    {!isFeedbackDisabled && (
                        <StarContainer>
                            <span>Оцінка:</span>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    style={{ cursor: "pointer", color: star <= rating ? "gold" : "gray" }}
                                    onClick={() => setRating(star)}
                                >
                                    ★
                                </span>
                            ))}
                        </StarContainer>
                    )}

                    <FeedbackButton 
                        type="submit" 
                        disabled={isFeedbackDisabled} 
                        style={{
                            backgroundColor: isFeedbackDisabled ? "gray" : "#007bff",
                        }}
                    >
                        {isFeedbackDisabled ? "Відгук додано" : "Додати відгук"}
                    </FeedbackButton>
                </FeedbackForm>
            </FeedbacksSection>
        </Modal>
    );
};

LocationInfo.propTypes = {
  info: PropTypes.shape({
    name: PropTypes.string.isRequired,
    location: PropTypes.string,
    phone: PropTypes.string,
    website: PropTypes.string,
    id: PropTypes.string.isRequired,
  }).isRequired,
  onChangeInfo: PropTypes.func.isRequired,
};

export default LocationInfo;
