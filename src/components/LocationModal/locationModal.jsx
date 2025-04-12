import React, { useState, useEffect, useCallback } from "react";
import {
  Checkbox,
  CloseBtn,
  CustomCheckbox,
  HeadWrapper,
  Label,
  LocationList,
  Modal,
  ModalTitle,
} from "./locationModal.styled";
import { useSearchParams } from 'react-router-dom';

const LocationModal = ({ onChangeLocation, onCategoryChange, initialSelectedCategories }) => {
  const categories = [
    { value: "restaurant", label: "Ресторани" },
    { value: "hotel", label: "Готель" },
    { value: "foodmarket", label: "Продукти" },
    { value: "hospital", label: "Лікарня" },
    { value: "park", label: "Парк" },
    { value: "entertaiment", label: "ТРЦ" },
    { value: "museum", label: "Музей" },
    { value: "pharmacy", label: "Аптека" },
    { value: "fuel", label: "Заправка" },
    { value: "bank", label: "Банк" },
    { value: "postoffice", label: "Пошта" },
    { value: "electricshop", label: "Електроніка" },
  ];

  const filters = [
    { value: "ramp", label: "Пандуси" },
    { value: "entrance", label: "Широкий вхід" },
    { value: "toilet", label: "Туалети" },
    { value: "tactile", label: "Для сліпих" },
    { value: "movement", label: "Вільне пересування" },
  ]

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    setSelectedCategories(initialSelectedCategories || []);
  }, [initialSelectedCategories]);

  const handlePlaces = (value) => {
    setSelectedCategories((prevSelected) => {
      const newPlaces = prevSelected.includes(value)
        ? prevSelected.filter((category) => category !== value)
        : [...prevSelected, value];

        onCategoryChange(newPlaces);

      return newPlaces;
    });
  };
  
  const handleFilters = useCallback((value) => {
    setSelectedFilters((prevSelected) => {
      const newFilters = prevSelected.includes(value)
        ? prevSelected.filter((filter) => filter !== value)
        : [...prevSelected, value];
  
      const params = new URLSearchParams(searchParams);
      if (newFilters.length > 0) {
        params.set('filters', newFilters.join(','));
      } else {
        params.delete('filters');
      }
  
      setSearchParams(params);
  
      return newFilters;
    });
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const filtersFromQuery = searchParams.get('filters');
    if (filtersFromQuery) {
      setSelectedFilters(filtersFromQuery.split(','));
    } else {
      setSelectedFilters([]);
    }
  }, [searchParams]);

  return (
    <Modal>
      <HeadWrapper>
        <ModalTitle>Локації</ModalTitle>
        <CloseBtn onClick={onChangeLocation} />
      </HeadWrapper>
      <LocationList>
        {categories.map((category) => (
          <Label key={category.value}>
            <Checkbox
              type="checkbox"
              checked={selectedCategories.includes(category.value)}
              onChange={() => handlePlaces(category.value)}
            />
            <CustomCheckbox />
            <img
              src={`/icons/${category.value}.svg`}
              alt={`${category.label} icon`}
              width="20px"
              height="20px"
            />
            {category.label}
          </Label>
        ))}
      </LocationList>
      <ModalTitle marginTop='18px'>Додаткові фільтри</ModalTitle>
      <LocationList>
        {filters.map((filter) => (
          <Label key={filter.value}>
            <Checkbox
              type="checkbox"
              checked={selectedFilters.includes(filter.value)}
              onChange={() => handleFilters(filter.value)}
            />
            <CustomCheckbox />
            <img
              src={`/icons/${filter.value}.svg`}
              alt={`${filter.label} icon`}
              width="20px"
              height="20px"
            />
            {filter.label}
          </Label>
        ))}
      </LocationList>
    </Modal>
  );
};

export default LocationModal;
