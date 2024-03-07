"use client";

// Importing necessary modules and components
import Select from "react-select";

// Importing custom hook to fetch countries data
import useSubCategory from "@/app/hooks/useSubCategory";

// Type definition for the value of the country select component
export type ProductValue = {
  cat: string; // subcategory
  label: string; // title
  value: string; // Value with all data
  category: string;
};

// Interface defining props accepted by the CountrySelect component
interface ProductSelectProps {
  value?: ProductValue; // Current selected value
  onChange: (value: ProductValue) => void; // Function to handle value change
}

// CountrySelect component
const SearchClientUser: React.FC<ProductSelectProps> = ({
  value, // Current selected value received as prop
  onChange, // Function to handle value change received as prop
}) => {
  // Custom hook to fetch countries data
  const { getAll } = useSubCategory();

  // Rendering the CountrySelect component
  return (
    <div>
      <Select
        placeholder="Enter A Product Name" // Placeholder text
        isClearable // Allowing to clear the selected value
        options={getAll()} // Options for the select component fetched using the custom hook
        value={value} // Current selected value
        onChange={(value) => onChange(value as ProductValue)} // Handling value change
        formatOptionLabel={(option: any) => (
          <div className="flex flex-row items-center gap-3 ">
            {" "}
            <div>{option.label}</div>
          </div>
        )}
        classNames={{
          // Customizing select component styles
          control: () => "p-3 border-2", // Style for control
          input: () => "text-lg", // Style for input
          option: () => "text-lg", // Style for option
        }}
        theme={(theme) => ({
          // Customizing select component theme
          ...theme,
          borderRadius: 6, // Border radius
          colors: {
            ...theme.colors,
            primary: "black", // Primary color
            primary25: "#ffe4e6", // Primary color with 25% opacity
          },
        })}
      />
    </div>
  );
};

export default SearchClientUser; // Exporting CountrySelect component
