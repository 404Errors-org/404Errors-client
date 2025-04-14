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
  const [accessibilityRate, setAccessibilityRate] = useState(0);

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

        if (currentLocation) {
          if (Array.isArray(currentLocation.tags)) {
            setCurrentLocationTags(currentLocation.tags);

            const initialFeatures = {};
            Object.keys(tagToFeatureName).forEach((tag) => {
              initialFeatures[tag] = currentLocation.tags.includes(tag);
            });
            setFeatures(initialFeatures);
          }

          if (currentLocation.accessibilityRate !== undefined) {
            setAccessibilityRate(currentLocation.accessibilityRate);
          }

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

  const renderStars = (value, maxStars = 5) => {
    return (
      <div style={{ display: "flex", marginBottom: "10px", alignItems: "center" }}>
        {[...Array(maxStars)].map((_, index) => (
          <span
            key={index}
            style={{
              color: index < value ? "gold" : "#ccc",
              fontSize: "22px",
              marginRight: "3px",
            }}
          >
            ★
          </span>
        ))}
        <span style={{ marginLeft: "5px", color: "#666", fontSize: "16px" }}>
          ({value} з {maxStars})
        </span>
      </div>
    );
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

      <div style={{ margin: "15px 0" }}>
        {accessibilityRate > 0 && (
          <div>
            <div style={{ fontWeight: "500", marginBottom: "5px" }}>Рейтинг доступності:</div>
            {renderStars(accessibilityRate)}
          </div>
        )}
      </div>

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
                aria-label={label}
              />
              <AccessibilityLabel htmlFor={tag}>{label}</AccessibilityLabel>
            </AccessibilityItem>
          );
        })}
      </AccessibilityContainer>
      <div>{}</div>

      {editing && (
        <form onSubmit={handleSave}>
          <EditButton type="submit" disabled={saving}>
            {saving ? "Зберігання..." : "Зберегти"}
          </EditButton>
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
