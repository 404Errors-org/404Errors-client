import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { InfoTitle } from "./locationInfo.styled";
import { getSuggestionsByLocation } from "../../services/suggestions";

const SuggestionSection = ({ Info, user }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchSuggestions = async () => {
      if (!Info?.id || !user?.hasDisability || !user?.token) return;

      setSuggestionsLoading(true);

      try {
        const suggestionsData = await getSuggestionsByLocation(Info.id, user.token, controller.signal);

        if (!isMounted) return;

        setSuggestions(suggestionsData);
      } catch (error) {
        if (!isMounted || error.name === "AbortError") return;
        console.error("Помилка при завантаженні пропозицій:", error);
      } finally {
        if (isMounted) {
          setSuggestionsLoading(false);
        }
      }
    };

    fetchSuggestions();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [Info?.id, user]);

  if (!user?.hasDisability) {
    return null;
  }

  return (
    <div style={{ marginTop: "20px", marginBottom: "20px" }}>
      <div
        onClick={() => setShowSuggestions(!showSuggestions)}
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
          {suggestionsLoading ? (
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
            <div style={{ textAlign: "center", padding: "10px", fontSize: "15px" }}>
              <p>Немає пропозицій щодо доступності для цього закладу</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

SuggestionSection.propTypes = {
  Info: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
  user: PropTypes.object,
};

export default SuggestionSection;
