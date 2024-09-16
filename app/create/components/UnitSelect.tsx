"use client";

import Select from "react-select";
import useQuantityTypes from "@/hooks/listing/use-quantitytype";

export type QuantityTypeValue = {
  quantityType: string;
  value: string;
};

interface ProductSelectProps {
  value?: QuantityTypeValue;
  onChange: (value: QuantityTypeValue) => void;
}

const UnitSelect: React.FC<ProductSelectProps> = ({ value, onChange }) => {
  const { getAll } = useQuantityTypes();

  return (
    <div className="relative peer">
      <Select
        placeholder="Unit"
        options={getAll()}
        value={value}
        onChange={(value) => onChange(value as QuantityTypeValue)}
        formatOptionLabel={(option: any) => (
          <div className="rounded-lg text-black">{option.label}</div>
        )}
        components={{
          DropdownIndicator: () => null,
          IndicatorSeparator: () => null,
        }}
        classNames={{
          control: () => "py-3 pl-2 shadow-sm",
          input: () => "text-lg",
          option: () => "text-xs",
          dropdownIndicator: () => "hidden",
        }}
        styles={{
          control: (base) => ({
            ...base,
            color: "black",
          }),
          singleValue: (base) => ({
            ...base,
            color: "black",
          }),
          input: (base) => ({
            ...base,
            color: "black",
          }),
          option: (base) => ({
            ...base,
            color: "black",
          }),
          placeholder: (base) => ({
            ...base,
            color: "black",
          }),
        }}
        theme={(theme) => ({
          ...theme,
          borderRadius: 10,
          colors: {
            ...theme.colors,
            primary: "#000",
            primary25: "#f0f0f0",
            neutral50: "black", // This controls the placeholder text color
            neutral80: "black",
          },
        })}
      />
    </div>
  );
};

export default UnitSelect;
