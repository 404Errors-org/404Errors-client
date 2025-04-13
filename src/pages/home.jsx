import React from "react";
import Header from "../components/Header/header";
import Map from "../components/map/map";
import LocationModal from "../components/LocationModal/locationModal";
import LocationInfo from "../components/LocationInfo/locationInfo";
import { usePlace } from "../context/placeContext";

const Home = () => {
  const { selectedLocation, infoVisible, toggleInfoVisible, setModal, modal } = usePlace();

  const getInfo = () => {
    const info = {};
    if (selectedLocation.name) {
      info.name = selectedLocation.name;
    }
    if (selectedLocation.street) {
      info.location = selectedLocation.street;
    }
    if (selectedLocation.phoneNumber) {
      info.phone = selectedLocation.phoneNumber;
    }
    if (selectedLocation.website) {
      info.website = selectedLocation.website;
    }
    if (selectedLocation.id) {
      info.id = selectedLocation.id;
    }
    return info;
  };

  const toggleModal = () => {
    if (infoVisible) {
      toggleInfoVisible();
    }
    setModal((prev) => !prev);
  };

  return (
    <>
      <Header onLocationClick={toggleModal} />
      {modal && <LocationModal onChangeLocation={toggleModal} />}
      {infoVisible ? <LocationInfo info={getInfo()} onChangeInfo={toggleInfoVisible} /> : null}
      <Map />
    </>
  );
};

export default Home;
