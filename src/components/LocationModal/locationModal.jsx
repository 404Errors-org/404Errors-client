import React from "react";
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
import { useFilters } from "../../context/filtersContext";

const LocationModal = ({ onChangeLocation }) => {
  const { selectedCategories, selectedFilters, handlePlaces, handleFilters } = useFilters();

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
  ];

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
            <img src={`/icons/${category.value}.svg`} alt={`${category.label} icon`} width="20px" height="20px" />
            {category.label}
          </Label>
        ))}
      </LocationList>
      <ModalTitle marginTop="18px">Додаткові фільтри</ModalTitle>
      <LocationList>
        {filters.map((filter) => (
          <Label key={filter.value}>
            <Checkbox
              type="checkbox"
              checked={selectedFilters.includes(filter.value)}
              onChange={() => handleFilters(filter.value)}
            />
            <CustomCheckbox />
            <img src={`/icons/${filter.value}.svg`} alt={`${filter.label} icon`} width="20px" height="20px" />
            {filter.label}
          </Label>
        ))}
      </LocationList>
    </Modal>
  );
};

export default LocationModal;
