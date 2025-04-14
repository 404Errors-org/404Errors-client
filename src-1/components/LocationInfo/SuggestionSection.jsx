import React from 'react';
import PropTypes from 'prop-types';
import { InfoTitle } from './locationInfo.styled';

const SuggestionSection = ({ suggestions, loading, showSuggestions, toggleSuggestions }) => {
  return (
    <div style={{ marginTop: "20px", marginBottom: "20px" }}>
      <div
        onClick={toggleSuggestions}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 15px",
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
          cursor: "pointer",
          marginBottom: "10px",
        }}
      >
        <InfoTitle style={{ margin: 0 }}>Пропозиції щодо доступності</InfoTitle>
        <span style={{ fontSize: "20px" }}>{showSuggestions ? "▼" : "►"}</span>
      </div>

      {showSuggestions && (
        <div
          style={{
            maxHeight: "200px",
            overflowY: "auto",
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            padding: "10px",
            backgroundColor: "#fafafa",
          }}
          aria-live="polite"
        >
          {loading ? (
            <div style={{ textAlign: "center", padding: "10px" }}>
              <p>Завантаження пропозицій...</p>
            </div>
          ) : suggestions.length > 0 ? (
            suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                style={{
                  margin: "10px 0",
                  padding: "12px",
                  backgroundColor: "#fff",
                  borderRadius: "6px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <p style={{ margin: "0 0 8px 0" }}>{suggestion.content}</p>
                <small style={{ color: "#666" }}>ID: {suggestion.id}</small>
              </div>
            ))
          ) : (
            <div style={{ textAlign: "center", padding: "10px" }}>
              <p>Немає пропозицій щодо доступності для цього закладу</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

SuggestionSection.propTypes = {
  suggestions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired,
  showSuggestions: PropTypes.bool.isRequired,
  toggleSuggestions: PropTypes.func.isRequired,
};

export default SuggestionSection;