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
          control: () => "p-3 bg shadow-xl peer",
          input: () => "text-lg",
          option: () => "text-xs",
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
