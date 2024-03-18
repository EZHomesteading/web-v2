import Select from "react-select";

export type listingValue = {
  cat: string;
  value: string;
  category: string;
};

interface ProductSelectProps {
  data: any;
  value?: listingValue;
  onChange: (value: listingValue) => void;
}

const SearchClient: React.FC<ProductSelectProps> = ({
  data,
  value,
  onChange,
}) => {
  return (
    <div>
      <Select
        placeholder="Enter A Product Name"
        isClearable
        options={data}
        value={value}
        onChange={(value) => onChange(value as listingValue)}
        formatOptionLabel={(data: any) => (
          <div className="flex flex-row items-center gap-3">
            {" "}
            <div>{data.value}</div>
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
