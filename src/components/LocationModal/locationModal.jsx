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
    <Modal role="dialog" aria-labelledby="modalTitle" aria-describedby="modalDescription">
      <HeadWrapper>
        <ModalTitle id="modalTitle">Локації</ModalTitle>
        <CloseBtn onClick={onChangeLocation} aria-label="Закрити модальне вікно" />
      </HeadWrapper>

      <LocationList aria-labelledby="categoriesTitle" id="categoriesTitle">
        {categories.map((category) => (
          <Label key={category.value}>
            <Checkbox
              type="checkbox"
              aria-checked={selectedCategories.includes(category.value)}
              onChange={() => handlePlaces(category.value)}
              aria-labelledby={`category-${category.value}-label`}
            />
            <CustomCheckbox />
            <img
              src={`/icons/${category.value}.svg`}
              alt={`${category.label} icon`}
              width="20px"
              height="20px"
              aria-hidden="true"
            />
            <span id={`category-${category.value}-label`}>{category.label}</span>
          </Label>
        ))}
      </LocationList>

      <ModalTitle marginTop="18px" id="filtersTitle">Додаткові фільтри</ModalTitle>
      <LocationList aria-labelledby="filtersTitle">
        {filters.map((filter) => (
          <Label key={filter.value}>
            <Checkbox
              type="checkbox"
              aria-checked={selectedFilters.includes(filter.value)}
              onChange={() => handleFilters(filter.value)}
              aria-labelledby={`filter-${filter.value}-label`}
            />
            <CustomCheckbox />
            <img
              src={`/icons/${filter.value}.svg`}
              alt={`${filter.label} icon`}
              width="20px"
              height="20px"
              aria-hidden="true"
            />
            <span id={`filter-${filter.value}-label`}>{filter.label}</span>
          </Label>
        ))}
      </LocationList>
    </Modal>
  );
};

export default LocationModal;