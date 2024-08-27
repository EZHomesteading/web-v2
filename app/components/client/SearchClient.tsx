"use client";
//search bar parent element
import Select from "react-select";
import useProduct from "@/hooks/use-product";

export type ProductValue = {
  cat: string;
  label: string;
  value: string;
  category: string;
  photo: string;
};

interface ProductSelectProps {
  value?: ProductValue;
  onChange: (value: ProductValue) => void;
}

const SearchClient: React.FC<ProductSelectProps> = ({ value, onChange }) => {
  const { getAll } = useProduct();

  return (
    <div>
      <Select
        placeholder="Enter A Product Name"
        isClearable
        options={getAll()}
        value={value}
        onChange={(value) => onChange(value as ProductValue)}
        formatOptionLabel={(option: { label: string }) => (
          <div className="flex flex-row items-center gap-3">
            {" "}
            <div>{option.label}</div>
          </div>
        )}
        components={{
          DropdownIndicator: () => null,
          IndicatorSeparator: () => null,
        }}
        classNames={{
          control: () => "p-2 shadow-md ",
          input: () => "text-2xl text-black",
          option: () => "text-xs",
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
