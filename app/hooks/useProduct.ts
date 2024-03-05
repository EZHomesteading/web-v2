const products = [
  {
    name: "Granny Smith",
    category: "Fruit",
    subCategory: "Apples",
    photo:
      "https://images.pexels.com/photos/16038614/pexels-photo-16038614/free-photo-of-abundance-of-granny-smith-apples.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  },
  {
    name: "Romaine Lettuce",
    category: "Vegetable",
    subCategory: "Lettuce",
    photo: "/images/product-images/Romaine.webp",
  },
  {
    name: "Basil",
    category: "Herb",
    subCategory: "Basil",
    photo: "",
  },
  {
    name: "Green Beans",
    category: "Vegetable",
    subCategory: "Beans",
    photo: "",
  },
  {
    name: "Head of Broccoli",
    category: "Vegetable",
    subCategory: "Broccoli",
    photo: "",
  },
  {
    name: "Pinto Beans",
    category: "Vegetable",
    subCategory: "Beans",
    photo: "",
  },
  {
    name: "Pumpkin",
    category: "Fruit",
    subCategory: "Pumpkins",
    photo: "",
  },
  {
    name: "Bell Pepper",
    category: "Fruit",
    subCategory: "Peppers",
    photo: "",
  },
  {
    name: "Ghost Pepper",
    category: "Fruit",
    subCategory: "Peppers",
    photo: "",
  },
  {
    name: "Habenero Pepper",
    category: "Fruit",
    subCategory: "Peppers",
    photo: "",
  },
  {
    name: "Jalapeno Pepper",
    category: "Fruit",
    subCategory: "Peppers",
    photo: "",
  },
];

const formattedProducts = products.map((product) => ({
  value: product.name,
  label: product.name,
  cat: product.subCategory,
  photo: product.photo,
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
