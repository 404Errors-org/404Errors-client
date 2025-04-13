import React from "react";
import { InfoDescription, InfoTitle, Modal, Website } from "./locationInfo.styled";
import { CloseBtn, HeadWrapper, ModalTitle } from "../LocationModal/locationModal.styled";
import PropTypes from "prop-types";

const LocationInfo = ({ info, onChangeInfo }) => {
  const infoVisible = () => onChangeInfo();
  return (
    <Modal>
      <HeadWrapper>
        <ModalTitle>{info.name}</ModalTitle>
        <CloseBtn onClick={infoVisible} />
      </HeadWrapper>
      {info.location || info.phone || info.website ? <InfoTitle>Адреса і контакти:</InfoTitle> : null}
      {info.location ? <InfoDescription type="location">{info.location}</InfoDescription> : null}
      {info.phone ? <InfoDescription type="number">{info.phone}</InfoDescription> : null}
      {info.website ? (
        <Website href={`${info.website}`} target="_blank">
          {info.website}
        </Website>
      ) : null}
    </Modal>
  );
};

LocationInfo.propTypes = {
  info: PropTypes.shape({
    name: PropTypes.string.isRequired,
    location: PropTypes.string,
    phone: PropTypes.string,
    website: PropTypes.string,
    id: PropTypes.string.isRequired,
  }).isRequired,
  onChangeInfo: PropTypes.func.isRequired,
};

export default LocationInfo;
