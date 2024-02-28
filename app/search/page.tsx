"use client";

import SearchClient, { ProductValue } from "./SearchClient";
import { useState } from "react";

const SearchPage = () => {
  const [product, setProduct] = useState<ProductValue>();
  return (
    <SearchClient
      value={product}
      onChange={(value) => setProduct(value as ProductValue)}
    />
  );
};

export default SearchPage;
