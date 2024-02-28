"use client";

// Importing necessary modules and components
import Select from "react-select";

// Importing custom hook to fetch countries data
import useCountries from "@/app/hooks/useCountries";

// Type definition for the value of the country select component
export type CountrySelectValue = {
  flag: string; // Flag of the country
  label: string; // Name of the country
  latlng: number[]; // Latitude and longitude of the country
  region: string; // Region of the country
  value: string; // Value of the country
};

// Interface defining props accepted by the CountrySelect component
interface CountrySelectProps {
  value?: CountrySelectValue; // Current selected value
  onChange: (value: CountrySelectValue) => void; // Function to handle value change
}

// CountrySelect component
const CountrySelect: React.FC<CountrySelectProps> = ({
  value, // Current selected value received as prop
  onChange, // Function to handle value change received as prop
}) => {
  // Custom hook to fetch countries data
  const { getAll } = useCountries();

  // Rendering the CountrySelect component
  return (
    <div>
      <Select
        placeholder="Where?" // Placeholder text
        isClearable // Allowing to clear the selected value
        options={getAll()} // Options for the select component fetched using the custom hook
        value={value} // Current selected value
        onChange={(value) => onChange(value as CountrySelectValue)} // Handling value change
        formatOptionLabel={(option: any) => (
          <div className="flex flex-row items-center gap-3">
            {" "}
            {/* Customizing option label */}
            <div>{option.flag}</div> {/* Flag of the country */}
            <div>
              {option.label}, {/* Name of the country */}
              <span className="text-neutral-500 ml-1">
                {option.region} {/* Region of the country */}
              </span>
            </div>
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

export default CountrySelect; // Exporting CountrySelect component
