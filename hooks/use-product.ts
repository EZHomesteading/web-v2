"use Client";
import { useState, useEffect, useMemo } from "react";
import { getProducts } from "./products";
import Fuse from "fuse.js";

type Product = {
  title: string;
  subCategory: string;
  photo: string;
};

export type FormattedProduct = {
  value: string;
  label: string;
  cat: string;
  photo: string;
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
      })),
    [products]
  );

  const fuse = useMemo(() => {
    const options = {
      keys: ["label"],
      threshold: 0.6,
      distance: 100,
      ignoreLocation: true,
      shouldSort: true,
      minMatchCharLength: 2,
    };
    return new Fuse<FormattedProduct>(formattedProducts, options);
  }, [formattedProducts]);

  const getAll = () => formattedProducts;

  const preprocessTerm = (term: string) =>
    term
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
      .toLowerCase()
      .trim();

  const searchSingleTerm = (term: string) => {
    const preprocessedTerm = preprocessTerm(term);
    return fuse.search(preprocessedTerm).map((result) => result.item);
  };

  const searchMultipleTerms = (terms: string[], originalQuery: string) => {
    const preprocessedQuery = preprocessTerm(originalQuery);
    return formattedProducts.filter((product) => {
      const preprocessedLabel = preprocessTerm(product.label);

      // Check for exact phrase match first
      if (preprocessedLabel.includes(preprocessedQuery)) {
        return true;
      }

      // If no exact match, check for all terms in any order
      return terms.every((term) => {
        const preprocessedTerm = preprocessTerm(term);
        return preprocessedLabel.includes(preprocessedTerm);
      });
    });
  };

  const searchProducts = (query: string) => {
    if (!query) return formattedProducts;

    const searchTerms = query.split(/\s+/).filter((term) => term.length > 0);

    if (searchTerms.length === 1) {
      return searchSingleTerm(searchTerms[0]);
    } else {
      const multiTermResults = searchMultipleTerms(searchTerms, query);

      return multiTermResults.length > 0
        ? multiTermResults
        : searchSingleTerm(query);
    }
  };

  return { getAll, setProducts, searchProducts };
};

export default useProducts;
