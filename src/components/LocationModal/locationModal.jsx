import React, { useState, useEffect } from "react";
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

  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    setSelectedCategories(initialSelectedCategories || []);
  }, [initialSelectedCategories]);

  const handleCheckboxChange = (value) => {
    setSelectedCategories((prevSelected) => {
      const newSelected = prevSelected.includes(value)
        ? prevSelected.filter((category) => category !== value)
        : [...prevSelected, value];

      onCategoryChange(newSelected);

      return newSelected;
    });
  };

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
              onChange={() => handleCheckboxChange(category.value)}
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
    </Modal>
  );
};

export default LocationModal;
