import React, { createContext, useContext, useState, useRef } from "react";

const PlaceContext = createContext();

export const PlaceProvider = ({ children }) => {
    const [selectedLocation, setSelectedLocation] = useState({});
    const [infoVisible, setInfoVisible] = useState(false);
    const lastSelectedLocationRef = useRef(null);
    const [modal, setModal] = useState(false)

    const changeSelectLocation = (newLocation) => {
        if (lastSelectedLocationRef.current && lastSelectedLocationRef.current.name === newLocation.name){
            setInfoVisible(false)
            lastSelectedLocationRef.current = null;
        }else{
            setSelectedLocation(newLocation);
            setModal(false)
            setInfoVisible(true);
            lastSelectedLocationRef.current = newLocation;
        }    
    };

    const toggleInfoVisible = () => {
        setInfoVisible((prev) => !prev);
        lastSelectedLocationRef.current = null;
    };

    return (
        <PlaceContext.Provider value={{ selectedLocation, infoVisible, changeSelectLocation, toggleInfoVisible, setModal, modal}}>
            {children}
        </PlaceContext.Provider>
    );
};

export const usePlace = () => {
    return useContext(PlaceContext);
};