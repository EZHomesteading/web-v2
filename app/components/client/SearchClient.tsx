"use client";

import React, { useCallback, useState } from "react";
import AsyncSelect from "react-select/async";
import { FormattedProduct } from "@/hooks/use-product";

interface ProductSelectProps {
  value?: FormattedProduct | null;
  subcat: string;
  onChange: (value: FormattedProduct | null) => void;
  onCustomAction: (value: string) => void;
  customActionLabel: string;
  inputValue: string;
  onInputChange: (value: string) => void;
  searchProducts: (query: string) => FormattedProduct[];
  getAll: () => FormattedProduct[];
}

const SearchClient: React.FC<ProductSelectProps> = ({
  value,
  onChange,
  subcat,
  onCustomAction,
  customActionLabel,
  inputValue,
  onInputChange,
  searchProducts,
  getAll,
}) => {
  const customAction: FormattedProduct = {
    value: "custom-action",
    label: customActionLabel,
    cat: "",
    photo: "",
  };

  const loadOptions = useCallback(
    async (input: string) => {
      let results: FormattedProduct[];

      if (input === "") {
        results = getAll().filter((product) => product.cat === subcat);
      } else {
        results = searchProducts(input).filter(
          (product) => product.cat === subcat
        );
      }

      const uniqueLabels = new Set();
      const uniqueResults = results.filter((product) => {
        if (!uniqueLabels.has(product.label)) {
          uniqueLabels.add(product.label);
          return true;
        }
        return false;
      });

      const limitedResults = uniqueResults.slice(0, 10);

      return [...limitedResults, customAction];
    },
    [searchProducts, getAll, subcat, customAction]
  );

  const handleChange = (selectedOption: FormattedProduct | null) => {
    if (selectedOption && selectedOption.value === "custom-action") {
      onCustomAction(inputValue);
    } else {
      onChange(selectedOption);
    }
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
        onInputChange={onInputChange}
        onChange={handleChange}
        loadOptions={loadOptions}
        formatOptionLabel={(option: FormattedProduct) => (
          <div className="flex flex-row items-center gap-3">
            <div>{option.label}</div>
          </div>
        )}
        components={{
          DropdownIndicator: () => null,
          IndicatorSeparator: () => null,
        }}
        classNames={{
          control: () => "p-2 shadow-sm h-[62px]",
          input: () => "text-md text-black",
          option: () => "text-xs",
        }}
        theme={(theme) => ({
          ...theme,
          borderRadius: 5,
          colors: {
            ...theme.colors,
            primary: "#000",
            primary25: "#fff",
          },
        })}
        blurInputOnSelect={false}
      />
    </div>
  );
};

export default SearchClient;
