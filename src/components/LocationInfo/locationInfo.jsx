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
import { CloseBtn, HeadWrapper, ModalTitle, StarContainer, CustomCheckbox, Checkbox } from "../LocationModal/locationModal.styled";
import { useAuth } from "../../context/authContext";
import { handleAddFeedback, getFeedbacksByLocation } from "../../services/feedback";
import { Tooltip } from "react-tooltip";

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
            getFeedbacksByLocation(Info.id, user.token)
                .then((feedbackData) => {
                    setFeedbacks(feedbackData);
                })
                .catch((error) => {
                    setError("Помилка при завантаженні відгуків: " + error.message); 
                });
        } else {
            alert("Будь ласка, увійдіть, щоб переглядати відгуки.");
        }
    }, [user, Info.id]);

    const isFeedbackDisabled = feedbacks.some(feedback => feedback.author === user?.username);

    const handleSave = () => {
        setEditing(false);
    };

    const handleAddFeedbackWithErrorHandling = async (e) => {
        e.preventDefault();
        try {
            await handleAddFeedback(e, user, feedbacks, setFeedbacks, setNewFeedback, setRating, rating, newFeedback, Info.id);
            setError(null); 
        } catch (err) {
            setError("Не вдалося додати відгук. Спробуйте ще раз.");
        }
    };

    return (
        <Modal aria-labelledby="modal-title" aria-hidden="false">
            <HeadWrapper>
                <ModalTitle id="modal-title">{Info.name}</ModalTitle>
                <CloseBtn onClick={infoVisible} aria-label="Закрити інформаційне вікно" />
            </HeadWrapper>

            {(Info.location || Info.phone || Info.website) && <InfoTitle>Адреса і контакти:</InfoTitle>}
            
            {Info.location && (
                <>
                    <InfoDescription
                        type="location"
                        data-tooltip-id="location-tooltip"
                        data-tooltip-content="Адреса розташування"
                        aria-labelledby="location-description"
                    >
                        {Info.location}
                    </InfoDescription>
                    <Tooltip id="location-tooltip" />
                </>
            )}
            
            {Info.phone && (
                <>
                    <InfoDescription
                        type="number"
                        data-tooltip-id="phone-tooltip"
                        data-tooltip-content="Контактний телефон"
                        aria-labelledby="phone-description"
                    >
                        {Info.phone}
                    </InfoDescription>
                    <Tooltip id="phone-tooltip" place="top-start" />
                </>
            )}

            {Info.website && (
                <Website href={Info.website} target="_blank" aria-label={`Перейти на сайт: ${Info.website}`}>
                    {Info.website}
                </Website>
            )}

            <AccessibilitySection>
                <InfoTitle>Рейтинг доступності закладу:</InfoTitle>
                <AccessibilityContainer aria-live="polite">
                    <AccessibilityItem>
                        <CustomCheckbox 
                            checked={features.hasRamp}
                            onChange={() => toggleFeature('hasRamp')}
                            icon={`/icons/hasRamp.svg`}
                            aria-label="Пандуси"
                        />
                        <AccessibilityLabel>Пандуси</AccessibilityLabel>
                    </AccessibilityItem>
                    <AccessibilityItem>
                        <CustomCheckbox 
                            checked={features.hasToilet}
                            onChange={() => toggleFeature('hasToilet')}
                            icon={`/icons/hasToilet.svg`}
                            aria-label="Широкий вхід"
                        />
                        <AccessibilityLabel>Широкий вхід</AccessibilityLabel>
                    </AccessibilityItem>
                    <AccessibilityItem>
                        <CustomCheckbox 
                            checked={features.wheelchairAccessible}
                            onChange={() => toggleFeature('wheelchairAccessible')}
                            icon={`/icons/wheelchairAccessible.svg`}
                            aria-label="Туалети"
                        />
                        <AccessibilityLabel>Туалети</AccessibilityLabel>
                    </AccessibilityItem>
                    <AccessibilityItem>
                        <CustomCheckbox 
                            checked={features.areBlind}
                            onChange={() => toggleFeature('areBlind')}
                            icon={`/icons/areBlind.svg`}
                            aria-label="Для сліпих"
                        />
                        <AccessibilityLabel>Для сліпих</AccessibilityLabel>
                    </AccessibilityItem>
                    <AccessibilityItem>
                        <CustomCheckbox 
                            checked={features.freetomove}
                            onChange={() => toggleFeature('freetomove')}
                            icon={`/icons/freetomove.svg`}
                            aria-label="Вільне пересування"
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
                <EditButton onClick={() => setEditing(true)} aria-label="Редагувати доступність">
                    Редагувати доступність
                </EditButton>
            )}

            <FeedbacksSection>
                <InfoTitle>Відгуки:</InfoTitle>
                <div style={{ maxHeight: "100px", overflowY: "auto" }}>
                    {feedbacks.length > 0 ? (
                        feedbacks.map(feedback => (
                            <FeedbackItem key={feedback.id} aria-labelledby={`feedback-${feedback.id}`}>
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

                <FeedbackForm onSubmit={handleAddFeedbackWithErrorHandling} aria-live="polite">
                    <FeedbackInput
                        value={newFeedback}
                        onChange={(e) => setNewFeedback(e.target.value)}
                        placeholder="Залишити відгук..."
                        required
                        disabled={isFeedbackDisabled}  
                        aria-label="Введіть ваш відгук"
                    />
                    {!isFeedbackDisabled && (
                        <StarContainer>
                            <span>Оцінка:</span>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    style={{ cursor: "pointer", color: star <= rating ? "gold" : "gray" }}
                                    onClick={() => setRating(star)}
                                    aria-label={`Оцінка ${star} з 5`}
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

export default LocationInfo;
