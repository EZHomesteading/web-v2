import { useState, useEffect } from "react";
import { products as defaultProducts } from "./products";

type Product = {
  name: string;
  category: string;
  subCategory: string;
  photo: string;
};

const useProducts = (initialProducts: Product[] = defaultProducts) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  const formattedProducts = products.map((product) => ({
    value: product.name,
    label: product.name,
    cat: product.subCategory,
    photo: product.photo,
    category: product.category,
  }));

  const getAll = () => formattedProducts;
  const getByValue = (value: string) => {
    return formattedProducts.find((item) => item.value === value);
  };

  return { getAll, getByValue, setProducts };
};

export default useProducts;
