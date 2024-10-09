import React, { useCallback, useState, useEffect, useRef } from "react";
import AsyncSelect from "react-select/async";
import { FormattedProduct } from "@/hooks/use-product";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";

// interface ProductSelectProps {
//   value: FormattedProduct | null;
//   subcat: string;
//   onChange: (value: FormattedProduct | null) => void;
//   onCustomAction: (value: string) => void;
//   customActionLabel: string;
//   searchProducts: (query: string) => FormattedProduct[];
//   getAll: () => FormattedProduct[];
// }

interface ProductSelectProps {
  title: string;
  value: FormattedProduct | null;
  subcat: string;
  onChange: (value: FormattedProduct | null) => void;
  onCustomAction: (value: string) => void;
  customActionLabel: string;
  searchProducts: (query: string) => FormattedProduct[];
  getAll: () => FormattedProduct[];
  onCustomTitleSet: () => void; // New prop
}

const SearchClient: React.FC<ProductSelectProps> = ({
  value,
  onChange,
  subcat,
  onCustomAction,
  customActionLabel,
  searchProducts,
  getAll,
  onCustomTitleSet,
  title,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [selectedOption, setSelectedOption] = useState<FormattedProduct | null>(
    value
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customTitleInput, setCustomTitleInput] = useState("");
  const selectRef = useRef<any>(null);

  useEffect(() => {
    if (value) {
      setInputValue(value.label);
      setSelectedOption(value);
    } else {
      setInputValue("");
      setSelectedOption(null);
    }
  }, [value]);

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
        results = getAll().filter((product) => product.cat.includes(subcat));
      } else {
        results = searchProducts(input).filter((product) =>
          product.cat.includes(subcat)
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

      const limitedResults = uniqueResults.slice(0, 6);

      return [...limitedResults, customAction];
    },
    [searchProducts, getAll, subcat, customAction]
  );

  const handleChange = (newValue: FormattedProduct | null) => {
    if (newValue && newValue.value === "custom-action") {
      onCustomAction(inputValue);
    } else {
      setSelectedOption(newValue);
      onChange(newValue);
      setInputValue(newValue ? newValue.label : "");

      // Force unfocus
      setTimeout(() => {
        if (selectRef.current) {
          selectRef.current.blur();
        }
      }, 0);
    }
  };

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === "Tab") {
      event.preventDefault();
      const exactMatch = loadOptions(inputValue).then((options) =>
        options.find(
          (option) => option.label.toLowerCase() === inputValue.toLowerCase()
        )
      );
      exactMatch.then((match) => {
        if (!match) {
          setCustomTitleInput(inputValue);
          setIsModalOpen(true);
        } else {
          handleChange(match);
        }
      });
    }
  };

  const handleUseCustomTitle = () => {
    onCustomAction(customTitleInput);
    onCustomTitleSet();
    setIsModalOpen(false);
  };

  return (
    <div>
      <AsyncSelect
        ref={selectRef}
        placeholder={title ? title : "Enter A Product Name"}
        isClearable
        cacheOptions
        defaultOptions
        value={selectedOption}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        onChange={handleChange}
        loadOptions={loadOptions}
        onKeyDown={handleKeyDown}
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
      />
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Use Custom Title?</DialogTitle>
            <DialogDescription>
              "{customTitleInput}" does not match any existing options. Would
              you like to use it as a custom title?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUseCustomTitle}>Use Custom Title</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SearchClient;
