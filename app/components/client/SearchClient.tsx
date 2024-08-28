"use client";

import React, { useState, useCallback } from "react";
import AsyncSelect from "react-select/async";
import useProducts from "@/hooks/use-product";
import { FormattedProduct } from "@/hooks/use-product";

interface ProductSelectProps {
  value?: FormattedProduct;
  subcat: string;
  onChange: (value: FormattedProduct | null) => void;
  onCustomAction: () => void;
  customActionLabel: string;
}

const SearchClient: React.FC<ProductSelectProps> = ({
  value,
  onChange,
  subcat,
  onCustomAction,
  customActionLabel,
}) => {
  const { searchProducts, getAll } = useProducts();
  const [inputValue, setInputValue] = useState("");
  const [isFirstOpen, setIsFirstOpen] = useState(true);

  const customAction: FormattedProduct = {
    value: "custom-action",
    label: customActionLabel,
    cat: "",
    category: "",
    photo: "",
  };

  const loadOptions = useCallback(
    async (inputValue: string) => {
      let results: FormattedProduct[];

      if (inputValue === "") {
        results = getAll().filter((product) => product.cat === subcat);
      } else {
        const preprocessedQuery = inputValue
          .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
          .toLowerCase()
          .trim();
        const searchResults = await searchProducts(preprocessedQuery);
        results = searchResults.filter((product) => product.cat === subcat);
      }

      // Limit to 10 product results
      const limitedResults = results.slice(0, 10);

      // Always add the custom action at the end
      return [...limitedResults, customAction];
    },
    [searchProducts, getAll, subcat, customAction]
  );

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
  };

  const handleChange = (selectedOption: FormattedProduct | null) => {
    if (selectedOption && selectedOption.value === "custom-action") {
      onCustomAction();
      onChange(null); // Clear the selection
    } else {
      onChange(selectedOption);
    }
  };

  const handleMenuOpen = () => {
    if (isFirstOpen) {
      setIsFirstOpen(false);
      setInputValue(" "); // This will trigger loadOptions with a non-empty string
      setTimeout(() => setInputValue(""), 0); // This will clear the input immediately after
    }
  };

  return (
    <div>
      <AsyncSelect
        placeholder="Enter A Product Name"
        isClearable
        cacheOptions
        defaultOptions={false}
        value={value}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        onChange={handleChange}
        loadOptions={loadOptions}
        onMenuOpen={handleMenuOpen}
        formatOptionLabel={(option: FormattedProduct) => (
          <div className="flex flex-row items-center gap-3">
            <div>{option.label}</div>
            {/* {option.category && (
              <div className="text-gray-400 text-xs">({option.category})</div>
            )} */}
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
