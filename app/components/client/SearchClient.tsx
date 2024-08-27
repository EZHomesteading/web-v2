"use client";

import React, { useState, useCallback } from "react";
import AsyncSelect from "react-select/async";
import useProducts from "@/hooks/use-product";
import { FormattedProduct } from "@/hooks/use-product";

interface ProductSelectProps {
  value?: FormattedProduct;
  onChange: (value: FormattedProduct) => void;
}

const SearchClient: React.FC<ProductSelectProps> = ({ value, onChange }) => {
  const { searchProducts } = useProducts();
  const [inputValue, setInputValue] = useState("");

  const loadOptions = useCallback(
    (inputValue: string) => {
      const preprocessedQuery = inputValue
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
        .toLowerCase()
        .trim();
      return Promise.resolve(searchProducts(preprocessedQuery));
    },
    [searchProducts]
  );

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
  };

  return (
    <div>
      <AsyncSelect
        placeholder="Enter A Product Name"
        isClearable
        cacheOptions
        defaultOptions
        value={value}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        onChange={(value) => onChange(value as FormattedProduct)}
        loadOptions={loadOptions}
        formatOptionLabel={(option: FormattedProduct) => (
          <div className="flex flex-row items-center gap-3">
            <div>{option.label}</div>
            <div className="text-gray-400 text-xs">({option.category})</div>
          </div>
        )}
        components={{
          DropdownIndicator: () => null,
          IndicatorSeparator: () => null,
        }}
        classNames={{
          control: () => "p-2 shadow-md",
          input: () => "text-2xl text-black",
          option: () => "text-sm",
        }}
        theme={(theme) => ({
          ...theme,
          borderRadius: 5,
          colors: {
            ...theme.colors,
            primary: "#ced9bb",
            primary25: "#ced9bb",
          },
        })}
      />
    </div>
  );
};

export default SearchClient;
