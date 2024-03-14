import Select from "react-select";
import useSubCategory from "../../hooks/useSubCategory";

export type ProductValue = {
  cat: string;
  value: string;
  category: string;
};

interface ProductSelectProps {
  value?: ProductValue;
  onChange: (value: ProductValue) => void;
}

const SearchClientUser: React.FC<ProductSelectProps> = ({
  value,
  onChange,
}) => {
  const { getAll } = useSubCategory();

  return (
    <div>
      <Select
        placeholder="Enter A Product Category"
        isClearable
        options={getAll()}
        value={value}
        onChange={(value) => onChange(value as ProductValue)}
        formatOptionLabel={(option: any) => (
          <div className="flex flex-row items-center gap-3">
            {" "}
            <div>{option.cat}</div>
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

export default SearchClientUser;
