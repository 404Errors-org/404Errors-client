import React from "react";
import PropTypes from "prop-types";
import { InfoTitle, InfoDescription } from "./locationInfo.styled";
import { Tooltip } from "react-tooltip";

const LocationDetails = ({ Info }) => {
  return (
    <>
      {Info?.location || Info?.phone ? <InfoTitle>Адреса і контакти:</InfoTitle> : null}

      {Info?.location ? (
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
      ) : null}

      {Info?.phone ? (
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
      ) : null}
    </>
  );
};

LocationDetails.propTypes = {
  Info: PropTypes.shape({
    location: PropTypes.string,
    phone: PropTypes.string,
  }).isRequired,
};

export default LocationDetails;
