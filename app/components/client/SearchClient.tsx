
import Select from "react-select";
import { SafeListing } from "@/app/types";

export type listingValue = {
  cat: string;
  value: string;
  category: string;
  
};

interface ProductSelectProps {
  data: listingValue;
  value?: listingValue;
  onChange: (value: listingValue) => void;
}


const SearchClient: React.FC<ProductSelectProps> = ({ data, value, onChange }) => {
const getAll = ()=> data;
  return (
    <div>
      <Select
        placeholder="Enter A Product Name"
        isClearable
        options={getAll()}
        value={value}
        onChange={(value) => onChange(value as listingValue)}
        formatOptionLabel={(option: any) => (
          <div className="flex flex-row items-center gap-3">
            {" "}
            <div>{option.value}</div>
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
