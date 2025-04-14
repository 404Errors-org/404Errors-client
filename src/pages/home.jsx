import React from "react";
import Header from "../components/Header/header";
import Map from "../components/map/map";
import LocationModal from "../components/LocationModal/locationModal";
import LocationInfo from "../components/LocationInfo/LocationInfo";
import { usePlace } from "../context/placeContext";

const Home = () => {
  const { selectedLocation, infoVisible, toggleInfoVisible, setModal, modal } = usePlace();

  const getInfo = () => {
    const Info = {};
    if (selectedLocation.name) {
      Info.name = selectedLocation.name;
    }
    if (selectedLocation.street) {
      Info.location = selectedLocation.street;
    }
    if (selectedLocation.phoneNumber) {
      Info.phone = selectedLocation.phoneNumber;
    }
    if (selectedLocation.website) {
      Info.website = selectedLocation.website;
    }
    if (selectedLocation.id) {
      Info.id = selectedLocation.id;
    }
    return Info;
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
      {infoVisible ? <LocationInfo Info={getInfo()} onChangeInfo={toggleInfoVisible} /> : null}
      <Map />
    </>
  );
};

export default Home;
