import React, { useState, useEffect } from "react";
import { Modal } from "./locationInfo.styled";
import { CloseBtn, HeadWrapper, ModalTitle } from "../LocationModal/locationModal.styled";
import { useAuth } from "../../context/authContext";
import { getLocations } from "../../services/locations";
import LocationDetails from "./LocationDetails";
import AccessibilitySection from "./AccessibilitySection";
import FeedbackSection from "./FeedbackSection";
import SuggestionSection from "./SuggestionSection";
import SuggestionModal from "./SuggestionModal";
import PropTypes from "prop-types";

const LocationInfo = ({ Info, onChangeInfo }) => {
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const [suggestionText, setSuggestionText] = useState("");
  const [locations, setLocations] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    let isMounted = true;

    const fetchLocationData = async () => {
      try {
        const response = await getLocations([], [], signal);
        if (isMounted && !signal.aborted && response && response.data) {
          setLocations(response.data);
        }
      } catch (error) {
        if (!signal.aborted && error.name !== "AbortError" && isMounted) {
          console.error("Error fetching locations:", error);
        }
      }
    };

    fetchLocationData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <Modal aria-labelledby="modal-title" aria-hidden="false">
      <HeadWrapper>
        <ModalTitle>
          {Info.name}
          {user && !user.hasDisability && (
            <button
              style={{
                marginLeft: "10px",
                padding: "5px 10px",
                fontSize: "14px",
                cursor: "pointer",
                backgroundColor: "#7CCDCD",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                fontWeight: 600,
              }}
              onClick={() => setShowSuggestionModal(true)}
            >
              Запропонувати зміну
            </button>
          )}
        </ModalTitle>
        <CloseBtn onClick={onChangeInfo} />
      </HeadWrapper>

      <LocationDetails Info={Info} />
      <AccessibilitySection Info={Info} user={user} locations={locations} />
      <SuggestionSection Info={Info} user={user} />
      <FeedbackSection Info={Info} user={user} />

      {showSuggestionModal && (
        <SuggestionModal
          Info={Info}
          user={user}
          suggestionText={suggestionText}
          setSuggestionText={setSuggestionText}
          onClose={() => setShowSuggestionModal(false)}
        />
      )}
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
    tags: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onChangeInfo: PropTypes.func.isRequired,
};

export default LocationInfo;
