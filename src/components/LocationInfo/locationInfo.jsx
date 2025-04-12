import React from "react";
import { InfoDescription, InfoTitle, Modal, Website } from "./locationInfo.styled";
import { CloseBtn, HeadWrapper, ModalTitle } from "../LocationModal/locationModal.styled";

const LocationInfo = ({Info, onChangeInfo}) => {
    const infoVisible = () => onChangeInfo()
    return(
        <Modal>
            <HeadWrapper>
                <ModalTitle>{Info.name}</ModalTitle>
                <CloseBtn onClick={infoVisible}/>
            </HeadWrapper>
            {Info.location || Info.phone || Info.website ? <InfoTitle>Адреса і контакти:</InfoTitle> : null}
            {Info.location ? <InfoDescription type='location'>{Info.location}</InfoDescription> : null}
            {Info.phone ? <InfoDescription type='number'>{Info.phone}</InfoDescription> : null}
            {Info.website ? <Website href={`${Info.website}`} target="_blank">{Info.website}</Website> : null}
        </Modal>
    )
}

export default LocationInfo