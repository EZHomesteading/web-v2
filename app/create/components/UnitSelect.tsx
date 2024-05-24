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
    <div>
      <Select
        placeholder="Enter A Unit of Measure"
        isClearable
        options={getAll()}
        value={value}
        onChange={(value) => onChange(value as QuantityTypeValue)}
        formatOptionLabel={(option: any) => (
          <div className="flex flex-row items-center gap-3">
            {" "}
            <div>{option.label}</div>
          </div>
        )}
        classNames={{
          control: () => "p-3 border-2",
          input: () => "text-lg",
          option: () => "text-lg",
        }}
        theme={(theme) => ({
          ...theme,
          borderRadius: 6,
          colors: {
            ...theme.colors,
            primary: "black",
            primary25: "#ffe4e6",
          },
        })}
      />
    </div>
  );
};

export default UnitSelect;
