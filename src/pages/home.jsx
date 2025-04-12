import React, { useState } from "react";
import Header from "../components/Header/header";
import Map from "../components/map/map";
import LocationModal from "../components/LocationModal/locationModal";
import LocationInfo from "../components/LocationInfo/locationInfo";
import { usePlace } from "../context/placeContext";

const Home = () => {
    const { selectedLocation, infoVisible, toggleInfoVisible, setModal, modal } = usePlace();
    const [selectedCategories, setSelectedCategories] = useState([]);

    const getInfo = () => {
        const Info = {};
        if (selectedLocation.name) {
            Info.name = selectedLocation.name;
        }
        if (selectedLocation['addr:street'] && selectedLocation['addr:housenumber']) {
            Info.location = `${selectedLocation['addr:street']} ${selectedLocation['addr:housenumber']}`;
        }
        if (selectedLocation.phone) {
            Info.phone = selectedLocation.phone;
        }
        if (selectedLocation.website) {
            Info.website = selectedLocation.website;
        }
        if (selectedLocation['@id']){
            Info.id = selectedLocation['@id']
        }
        Info.coordinate = selectedLocation.coordinate
        return Info
    }

    const handleCategoryChange = (categories) => {
        setSelectedCategories(categories);
    };

    const toggleModal = () => {
        if(infoVisible){
            toggleInfoVisible()
        }
        setModal((prev) => !prev);
    };

    return (
        <>
            <Header onLocationClick={toggleModal} selectedCategories={selectedCategories}/>
            {modal && (
                <LocationModal
                    onChangeLocation={toggleModal}
                    onCategoryChange={handleCategoryChange}
                    initialSelectedCategories={selectedCategories}
                />
                )}
            {infoVisible ? <LocationInfo Info={getInfo()} onChangeInfo={toggleInfoVisible} /> : null}
            <Map selectedCategories={selectedCategories} />
        </>
    );
};

export default Home;
