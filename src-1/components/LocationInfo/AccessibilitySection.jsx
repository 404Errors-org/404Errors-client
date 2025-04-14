import React from "react";
import PropTypes from "prop-types";
import {
  AccessibilityContainer,
  AccessibilityItem,
  AccessibilityLabel,
} from "./locationInfo.styled";

const AccessibilitySection = ({ features, editing, toggleFeature, tagToFeatureName }) => {
  return (
    <div>
      <h2>Рейтинг доступності закладу:</h2>
      <AccessibilityContainer>
        {Object.entries(tagToFeatureName).map(([tag, label]) => (
          <AccessibilityItem key={tag}>
            <input
              type="checkbox"
              id={tag}
              checked={editing ? features?.[tag] || false : false}
              onChange={() => editing && toggleFeature(tag)}
              readOnly={!editing}
            />
            <AccessibilityLabel htmlFor={tag}>{label}</AccessibilityLabel>
          </AccessibilityItem>
        ))}
      </AccessibilityContainer>
    </div>
  );
};

AccessibilitySection.propTypes = {
  features: PropTypes.object.isRequired,
  editing: PropTypes.bool.isRequired,
  toggleFeature: PropTypes.func.isRequired,
  tagToFeatureName: PropTypes.object.isRequired,
};

export default AccessibilitySection;