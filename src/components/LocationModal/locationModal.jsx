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
import { Tooltip } from "react-tooltip";

const LocationModal = ({ onChangeLocation }) => {
  const { selectedCategories, selectedFilters, handlePlaces, handleFilters } = useFilters();

  const categories = [
    { value: "restaurant", label: "Ресторани", tooltip: "Доступні ресторани з інклюзивними послугами" },
    { value: "hotel", label: "Готель", tooltip: "Готелі з доступністю для людей з особливими потребами" },
    { value: "foodmarket", label: "Продукти", tooltip: "Продуктові магазини з доступністю" },
    { value: "hospital", label: "Лікарня", tooltip: "Лікарні з інклюзивними послугами" },
    { value: "park", label: "Парк", tooltip: "Парки з доступними маршрутами" },
    { value: "entertaiment", label: "ТРЦ", tooltip: "Торгово-розважальні центри з інклюзивною інфраструктурою" },
    { value: "museum", label: "Музей", tooltip: "Музеї з доступністю для людей з особливими потребами" },
    { value: "pharmacy", label: "Аптека", tooltip: "Доступні аптеки" },
    { value: "fuel", label: "Заправка", tooltip: "Заправки з інклюзивними послугами" },
    { value: "bank", label: "Банк", tooltip: "Банки з доступністю для людей з особливими потребами" },
    { value: "postoffice", label: "Пошта", tooltip: "Пошти з інклюзивними послугами" },
    { value: "electricshop", label: "Електроніка", tooltip: "Магазини електроніки з доступністю" },
  ];

  const filters = [
    { value: "ramp", label: "Пандуси", tooltip: "Місця, що мають пандуси для зручного доступу" },
    { value: "entrance", label: "Широкий вхід", tooltip: "Місця з широким входом для зручного доступу" },
    { value: "toilet", label: "Туалети", tooltip: "Місця з доступними туалетами" },
    { value: "tactile", label: "Для незрячих людей", tooltip: "Місця з тактильними вказівниками для незрячих людей" },
    { value: "movement", label: "Вільне пересування", tooltip: "Місця з безбар'єрним пересуванням всередині" },
  ];

  return (
    <Modal>
      <HeadWrapper>
        <ModalTitle data-tooltip-id="location-title-tooltip">Локації</ModalTitle>
        <Tooltip id="location-title-tooltip" content="Виберіть тип локацій для пошуку" place="top" float={true} />
        <CloseBtn onClick={onChangeLocation} data-tooltip-id="close-button-tooltip" />
        <Tooltip id="close-button-tooltip" content="Закрити вікно" place="left" />
      </HeadWrapper>
      <LocationList>
        {categories.map((category) => (
          <Label
            key={category.value}
            data-tooltip-id={`category-tooltip-${category.value}`}
            data-tooltip-content={category.tooltip}
          >
            <Checkbox
              type="checkbox"
              checked={selectedCategories.includes(category.value)}
              onChange={() => handlePlaces(category.value)}
            />
            <CustomCheckbox />
            <img src={`/icons/${category.value}.svg`} alt={`${category.label} icon`} width="20px" height="20px" />
            {category.label}
            <Tooltip id={`category-tooltip-${category.value}`} place="top" />
          </Label>
        ))}
      </LocationList>
      <ModalTitle data-tooltip-id="filter-tooltip" marginTop="18px">
        Додаткові фільтри
      </ModalTitle>
      <Tooltip id="filter-tooltip" content="Виберіть фільтри для покращення пошуку" place="top" float={true} />
      <LocationList>
        {filters.map((filter) => (
          <Label
            key={filter.value}
            data-tooltip-id={`filter-tooltip-${filter.value}`}
            data-tooltip-content={filter.tooltip}
          >
            <Checkbox
              type="checkbox"
              checked={selectedFilters.includes(filter.value)}
              onChange={() => handleFilters(filter.value)}
            />
            <CustomCheckbox />
            <img src={`/icons/${filter.value}.svg`} alt={`${filter.label} icon`} width="20px" height="20px" />
            {filter.label}
            <Tooltip id={`filter-tooltip-${filter.value}`} place="top" />
          </Label>
        ))}
      </LocationList>
    </Modal>
  );
};

export default LocationModal;
