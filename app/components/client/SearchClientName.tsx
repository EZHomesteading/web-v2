import { BsBasket } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
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
      <div className="flex items-center">
        <BsBasket className="absolute left-2 text-lg text-gray-400 z-50" />
        <Select
          placeholder="What?"
          isClearable
          options={data}
          value={value}
          onChange={(value) => onChange(value as listingValue)}
          formatOptionLabel={(data: any) => (
            <div className="flex flex-row items-center gap-3 ">
              {" "}
              <div>{data.value}</div>
            </div>
          )}
          classNames={{
            control: (state) =>
              `rounded-r-full sm:rounded-l-none sm:rounded-r-full py-[2px] pl-6 pr-5 outline-none transition-all duration-200 border something ${
                state.isFocused
                  ? "bg-white border-black scale-120"
                  : "bg-gray-100 border-gray-300"
              } sm:w-50`,
            input: () => "",
            option: () => "",
          }}
          theme={(theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
              primary: "black",
              primary25: "#ffe4e6",
            },
          })}
          styles={{
            control: (provided, state) => ({
              ...provided,
              transform: state.isFocused ? "scale(1.03)" : "scale(1)",
              zIndex: state.isFocused ? "20" : "1",
            }),
          }}
        />
        <FiSearch className="absolute z-50 right-0 mr-2 top-1/2 transform -translate-y-1/2 text-lg text-gray-400" />
      </div>
    </div>
  );
};

export default SearchClient;
