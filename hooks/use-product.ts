import { useState, useEffect, useMemo } from "react";
import { getProducts } from "./products";
import Fuse from "fuse.js";

type Product = {
  title: string;
  category: string;
  subCategory: string;
  photo: string;
};

export type FormattedProduct = {
  value: string;
  label: string;
  cat: string;
  photo: string;
  category: string;
};

const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const fetchedProducts = await getProducts;
      setProducts(fetchedProducts);
    };

    fetchProducts();
  }, []);

  const formattedProducts = useMemo(
    () =>
      products.map((product) => ({
        value: product.title,
        label: product.title,
        cat: product.subCategory,
        photo: product.photo,
        category: product.category,
      })),
    [products]
  );

  const fuse = useMemo(() => {
    const options = {
      keys: ["label"],
      threshold: 0.4,
      distance: 100,
      ignoreLocation: true,
      shouldSort: true,
      minMatchCharLength: 2,
    };
    return new Fuse<FormattedProduct>(formattedProducts, options);
  }, [formattedProducts]);

  const getAll = () => formattedProducts;

  // const getByValue = (value: string) => {
  //   return formattedProducts.find((item) => item.value === value);
  // };

  const searchProducts = (query: string) => {
    if (!query) return formattedProducts;
    const preprocessedQuery = query
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
      .toLowerCase()
      .trim();
    return fuse.search(preprocessedQuery).map((result) => result.item);
  };

  return { getAll, setProducts, searchProducts };
};

export default useProducts;
