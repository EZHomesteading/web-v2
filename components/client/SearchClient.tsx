"use client";

import Select from "react-select";
import useProduct from "@/hooks/useProduct";

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

export default SearchClient;
