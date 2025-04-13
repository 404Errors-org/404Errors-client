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
import { Checkbox, CustomCheckbox } from "../LocationModal/locationModal.styled";

const LocationInfo = ({ Info, onChangeInfo }) => {
    const infoVisible = () => onChangeInfo();
    const { user } = useAuth();
    const [editing, setEditing] = useState(false);
    const [features, setFeatures] = useState(Info.accessibilityFeatures || {});
    const [feedbacks, setFeedbacks] = useState([]);
    const [newFeedback, setNewFeedback] = useState('');
    const [rating, setRating] = useState(0);
    const [error, setError] = useState(null); // Додаємо стан для помилок

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
                    setError("Помилка при завантаженні відгуків: " + error.message); // Обробка помилки
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
            setError(null); // Якщо все пройшло добре, очистимо помилку
        } catch (err) {
            setError("Не вдалося додати відгук. Спробуйте ще раз.");
        }
    };

    return (
        <Modal>
            <HeadWrapper>
                <ModalTitle>{Info.name}</ModalTitle>
                <CloseBtn onClick={infoVisible} />
            </HeadWrapper>

            {(Info.location || Info.phone || Info.website) && <InfoTitle>Адреса і контакти:</InfoTitle>}
            {Info.location && <InfoDescription type="location">{Info.location}</InfoDescription>}
            {Info.phone && <InfoDescription type="number">{Info.phone}</InfoDescription>}
            {Info.website && <Website href={Info.website} target="_blank">{Info.website}</Website>}

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
                    {/* Ваші поля для редагування доступності */}
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

                {/* Виведення помилки */}
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


export default LocationInfo;
