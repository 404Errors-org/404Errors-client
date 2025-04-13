import React from "react";
import { InfoDescription, InfoTitle, Modal } from "./locationInfo.styled";
import { CloseBtn, HeadWrapper, ModalTitle } from "../LocationModal/locationModal.styled";
import { Tooltip } from "react-tooltip";

const LocationInfo = ({ Info, onChangeInfo }) => {
  const infoVisible = () => onChangeInfo();
  return (
    <Modal>
      <HeadWrapper>
        <ModalTitle>{Info.name}</ModalTitle>
        <CloseBtn onClick={infoVisible} />
      </HeadWrapper>

      {Info.location || Info.phone ? <InfoTitle>Адреса і контакти:</InfoTitle> : null}

      {Info.location ? (
        <>
          <InfoDescription
            type="location"
            data-tooltip-id="location-tooltip"
            data-tooltip-content="Адреса розташування"
          >
            {Info.location}
          </InfoDescription>
          <Tooltip id="location-tooltip" />
        </>
      ) : null}

      {Info.phone ? (
        <>
          <InfoDescription type="number" data-tooltip-id="phone-tooltip" data-tooltip-content="Контактний телефон">
            {Info.phone}
          </InfoDescription>
          <Tooltip id="phone-tooltip" place="top-start" />
        </>
      ) : null}
    </Modal>
  );
};

export default LocationInfo;
