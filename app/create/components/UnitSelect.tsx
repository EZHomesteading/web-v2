"use client";

import Select from "react-select";
import useQuantityTypes from "@/hooks/listing/use-quantitytype";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});
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
  const defaultValue = "lb";
  return (
    <div className="relative peer">
      <Select
        placeholder="Unit"
        isClearable
        options={getAll()}
        value={value}
        onChange={(value) => onChange(value as QuantityTypeValue)}
        formatOptionLabel={(option: any) => (
          <div className="">{option.label}</div>
        )}
        components={{
          DropdownIndicator: () => null,
          IndicatorSeparator: () => null,
        }}
        classNames={{
          control: () => "p-3 bg shadow-xl peer",
          input: () => "text-lg",
          option: () => "text-lg z-10",
          dropdownIndicator: () => "hidden",
        }}
        theme={(theme) => ({
          ...theme,
          borderRadius: 20,
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

export default UnitSelect;
