import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useAuth } from "../../context/authContext";
import { getLocations } from "../../services/locations";
import { handleAddFeedback, getFeedbacksByLocation, updateLocationTags } from "../../services/feedback";
import { sendSuggestion, getSuggestionsByLocation } from "../../services/suggestions";
import AccessibilitySection from "./AccessibilitySection";
import FeedbackSection from "./FeedbackSection";
import LocationDetails from "./LocationDetails";
import SuggestionSection from "./SuggestionSection";
import SuggestionModal from "./SuggestionModal";
import { Modal, CloseBtn, HeadWrapper, ModalTitle } from "../LocationModal/locationModal.styled";

const LocationInfo = ({ Info, onChangeInfo }) => {
  const { user } = useAuth();
  const [locations, setLocations] = useState([]);
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const fetchLocationData = async () => {
      const response = await getLocations();
      setLocations(response.data);
    };

    fetchLocationData();
  }, []);

  return (
    <Modal aria-labelledby="modal-title" aria-hidden="false">
      <HeadWrapper>
        <ModalTitle>{Info.name}</ModalTitle>
        <CloseBtn onClick={onChangeInfo} />
      </HeadWrapper>

      <LocationDetails Info={Info} />
      <AccessibilitySection Info={Info} user={user} setLocations={setLocations} />
      <FeedbackSection Info={Info} user={user} setSubmitSuccess={setSubmitSuccess} />
      <SuggestionSection Info={Info} user={user} setShowSuggestionModal={setShowSuggestionModal} />

      {showSuggestionModal && (
        <SuggestionModal Info={Info} user={user} setShowSuggestionModal={setShowSuggestionModal} />
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