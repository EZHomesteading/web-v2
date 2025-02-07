const quantityTypes = [
  {
    quantityType: "lb",
  },
  {
    quantityType: "oz",
  },
  {
    quantityType: "pint",
  },
  {
    quantityType: "quart",
  },
  {
    quantityType: "gallon",
  },
  {
    quantityType: "bushel",
  },
  {
    quantityType: "peck",
  },
  {
    quantityType: "crate",
  },
  {
    quantityType: "basket",
  },
  {
    quantityType: "bag",
  },
  {
    quantityType: "box",
  },
  {
    quantityType: "bunch",
  },
  {
    quantityType: "dozen",
  },
  {
    quantityType: "bulb",
  },
  {
    quantityType: "each",
  },

  {
    quantityType: "none",
  },
];

const formattedTypes = quantityTypes.map((product) => ({
  value: product.quantityType,
  label: product.quantityType,
}));
const useQuantityTypes = () => {
  const getAll = () => formattedTypes;

  const getByValue = (value: string) => {
    return formattedTypes.find((item) => item.value === value);
  };

  return {
    getAll,
    getByValue,
  };
};

export default useQuantityTypes;
