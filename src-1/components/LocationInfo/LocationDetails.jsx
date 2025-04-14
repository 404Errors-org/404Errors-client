import React from "react";
import PropTypes from "prop-types";
import { InfoDescription, InfoTitle } from "./locationInfo.styled";
import { Tooltip } from "react-tooltip";

const LocationDetails = ({ locationInfo }) => {
  return (
    <>
      {locationInfo?.location || locationInfo?.phone ? <InfoTitle>Адреса і контакти:</InfoTitle> : null}

      {locationInfo?.location ? (
        <>
          <InfoDescription
            type="location"
            data-tooltip-id="location-tooltip"
            data-tooltip-content="Адреса розташування"
            aria-labelledby="location-description"
          >
            {locationInfo.location}
          </InfoDescription>
          <Tooltip id="location-tooltip" />
        </>
      ) : null}

      {locationInfo?.phone ? (
        <>
          <InfoDescription
            type="number"
            data-tooltip-id="phone-tooltip"
            data-tooltip-content="Контактний телефон"
            aria-labelledby="phone-description"
          >
            {locationInfo.phone}
          </InfoDescription>
          <Tooltip id="phone-tooltip" place="top-start" />
        </>
      ) : null}
    </>
  );
};

LocationDetails.propTypes = {
  locationInfo: PropTypes.shape({
    location: PropTypes.string,
    phone: PropTypes.string,
  }).isRequired,
};

export default LocationDetails;