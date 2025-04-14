import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import {
  AccessibilitySection as StyledAccessibilitySection,
  AccessibilityContainer,
  AccessibilityItem,
  AccessibilityLabel,
  EditButton,
  InfoTitle,
} from "./locationInfo.styled";
import { Tooltip } from "react-tooltip";
import { updateLocationTags } from "../../services/feedback";

const updatedTagsCache = {};

const AccessibilitySection = ({ Info, user, locations }) => {
  const [editing, setEditing] = useState(false);
  const [features, setFeatures] = useState(Info?.accessibilityFeatures || {});
  const [saving, setSaving] = useState(false);
  const [tagUpdateError, setTagUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [currentLocationTags, setCurrentLocationTags] = useState([]);

  const tagToFeatureName = {
    ramp: "Пандуси",
    entrance: "Широкий вхід",
    toilet: "Туалети",
    tactile: "Для незрячих людей",
    movement: "Вільне пересування",
  };

  const toggleFeature = (key) => {
    setFeatures((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const initializeFeatures = useCallback(() => {
    if (Info?.id) {
      if (updatedTagsCache[Info.id]) {
        setCurrentLocationTags(updatedTagsCache[Info.id]);

        const cachedFeatures = {};
        Object.keys(tagToFeatureName).forEach((tag) => {
          cachedFeatures[tag] = updatedTagsCache[Info.id].includes(tag);
        });
        setFeatures(cachedFeatures);
        return true;
      }

      if (locations.length > 0) {
        const currentLocation = locations.find((location) => location.id === Info.id);

        if (currentLocation && Array.isArray(currentLocation.tags)) {
          setCurrentLocationTags(currentLocation.tags);

          const initialFeatures = {};
          Object.keys(tagToFeatureName).forEach((tag) => {
            initialFeatures[tag] = currentLocation.tags.includes(tag);
          });
          setFeatures(initialFeatures);
          return true;
        }
      }
    }
    return false;
  }, [Info?.id, locations]);

  useEffect(() => {
    initializeFeatures();
  }, [initializeFeatures]);

  const handleSave = async (e) => {
    e.preventDefault();

    if (!user?.token || !Info?.id) {
      setTagUpdateError("Необхідно авторизуватися для зміни тегів");
      return;
    }

    try {
      setSaving(true);
      setTagUpdateError(null);

      const updatedTags = Object.entries(features)
        .filter(([_, isEnabled]) => isEnabled)
        .map(([tag, _]) => tag);

      await updateLocationTags(Info.id, updatedTags, user.token);

      setCurrentLocationTags(updatedTags);

      updatedTagsCache[Info.id] = updatedTags;

      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
      setEditing(false);
    } catch (error) {
      setTagUpdateError("Не вдалося оновити теги закладу: " + (error.message || "Невідома помилка"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <StyledAccessibilitySection>
      <InfoTitle data-tooltip-id="desc-accessibility">Рейтинг доступності закладу:</InfoTitle>
      <Tooltip
        id="desc-accessibility"
        place="top"
        content={
          user?.hasDisability
            ? "Ви можете редагувати ці параметри як користувач з підтвердженою інвалідністю"
            : "Цю секцію можуть змінювати лише користувачі, які підтвердили свою інвалідність"
        }
      />
      {tagUpdateError && (
        <div
          style={{
            backgroundColor: "#fff3cd",
            color: "#856404",
            padding: "10px",
            borderRadius: "5px",
            marginBottom: "10px",
          }}
        >
          {tagUpdateError}
        </div>
      )}
      {updateSuccess && (
        <div
          style={{
            backgroundColor: "#d4edda",
            color: "#155724",
            padding: "10px",
            borderRadius: "5px",
            marginBottom: "10px",
          }}
        >
          Теги успішно оновлено!
        </div>
      )}
      <AccessibilityContainer>
        {Object.entries(tagToFeatureName).map(([tag, label]) => {
          const isTagPresent = !editing && currentLocationTags.includes(tag);

          return (
            <AccessibilityItem key={tag}>
              <input
                type="checkbox"
                id={tag}
                checked={editing ? features?.[tag] || false : isTagPresent || false}
                onChange={() => editing && toggleFeature(tag)}
                readOnly={!editing}
              />
              <AccessibilityLabel htmlFor={tag}>{label}</AccessibilityLabel>
            </AccessibilityItem>
          );
        })}
      </AccessibilityContainer>

      {editing && (
        <form onSubmit={handleSave}>
          <button
            type="submit"
            disabled={saving}
            style={{
              backgroundColor: saving ? "#ccc" : "#007bff",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "4px",
              cursor: saving ? "not-allowed" : "pointer",
              margin: "10px 0",
              width: "100%",
            }}
          >
            {saving ? "Зберігання..." : "Зберегти"}
          </button>
        </form>
      )}

      {user?.hasDisability && !editing && (
        <EditButton onClick={() => setEditing(true)}>Редагувати доступність</EditButton>
      )}
    </StyledAccessibilitySection>
  );
};

AccessibilitySection.propTypes = {
  Info: PropTypes.shape({
    id: PropTypes.string.isRequired,
    accessibilityFeatures: PropTypes.object,
  }).isRequired,
  user: PropTypes.object,
  locations: PropTypes.array.isRequired,
};

export default AccessibilitySection;
