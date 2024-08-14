"use client";
//unit autocomplete searchable field
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
        isClearable
        options={getAll()}
        value={value}
        onChange={(value) => onChange(value as QuantityTypeValue)}
        formatOptionLabel={(option: any) => (
          <div className="rounded-lg">{option.label}</div>
        )}
        components={{
          DropdownIndicator: () => null,
          IndicatorSeparator: () => null,
        }}
        classNames={{
          control: () => "py-3 pl-2 shadow-sm peer font-extralight",
          input: () => "text-lg font-extralight",
          option: () => "text-xs font-extralight",
          dropdownIndicator: () => "hidden",
          placeholder: () => "text-black",
        }}
        theme={(theme) => ({
          ...theme,
          borderRadius: 10,
          colors: {
            ...theme.colors,
            primary: "#fff",
            primary25: "#fff",
          },
        })}
      />
    </div>
  );
};

export default UnitSelect;
