const products = [
  {
    name: "Granny Smith",
    category: "Fruit",
    subCategory: "Apples",
    shelfLife: 7,
    suggestPrice: 0.25,
    suggestedUnits: "EA",
  },
  {
    name: "Romaine Lettuce",
    category: "Vegetable",
    subCategory: "Lettuce",
    shelfLife: 3,
    suggestPrice: 1.0,
    suggestedUnits: "EA",
  },
  {
    name: "Basil",
    category: "Herb",
    subCategory: "Basil",
    shelfLife: 3,
    suggestPrice: 1.0,
    suggestedUnits: "OZ",
  },
  {
    name: "Green Beans",
    category: "Vegetable",
    subCategory: "Beans",
    shelfLife: 7,
    suggestPrice: 1.25,
    suggestedUnits: "OZ",
  },
  {
    name: "Head of Broccoli",
    category: "Vegetable",
    subCategory: "Broccoli",
    shelfLife: 7,
    suggestPrice: 1,
    suggestedUnits: "EA",
  },
  {
    name: "Pinto Beans",
    category: "Vegetable",
    subCategory: "Beans",
    shelfLife: 7,
    suggestPrice: 4.0,
    suggestedUnits: "Lb",
  },
  {
    name: "Pumpkin",
    category: "Fruit",
    subCategory: "Pumpkins",
    shelfLife: 7,
    suggestPrice: 0.25,
    suggestedUnits: "EA",
  },
  {
    name: "Bell Pepper",
    category: "Fruit",
    subCategory: "Peppers",
    shelfLife: 7,
    suggestPrice: 0.5,
    suggestedUnits: "EA",
  },
  {
    name: "Ghost Pepper",
    category: "Fruit",
    subCategory: "Peppers",
    shelfLife: 7,
    suggestPrice: 0.5,
    suggestedUnits: "EA",
  },
  {
    name: "Habenero Pepper",
    category: "Fruit",
    subCategory: "Peppers",
    shelfLife: 7,
    suggestPrice: 0.5,
    suggestedUnits: "EA",
  },
  {
    name: "Jalapeno Pepper",
    category: "Fruit",
    subCategory: "Peppers",
    shelfLife: 7,
    suggestPrice: 0.5,
    suggestedUnits: "EA",
  },
];

const formattedProducts = products.map((product) => ({
  value: product.name,
  label: product.name,
  cat: product.subCategory,
  shelfLife: product.shelfLife,
  category: product.category,
  price: product.suggestPrice,
  units: product.suggestedUnits,
}));

const useProducts = () => {
  const getAll = () => formattedProducts;

  const getByValue = (value: string) => {
    return formattedProducts.find((item) => item.value === value);
  };

  return {
    getAll,
    getByValue,
  };
};

export default useProducts;
