import { BsBasket } from "react-icons/bs";
import { IoIosSearch } from "react-icons/io";

interface SearchInputProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
  focus: { left: boolean; right: boolean };
  setFocus: (focus: { left: boolean; right: boolean }) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  focus,
  setFocus,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="relative flex items-center mb-2 sm:mb-0 ">
      <BsBasket className="absolute text-black text-lg left-2" />
      <input
        type="text"
        placeholder="Everything"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="rounded-md text-black sm:rounded-r-full px-4 py-2 pl-8 outline-none transition-all border-[.1px] border-black duration-200"
        onFocus={() => setFocus({ ...focus, right: true })}
        onBlur={() => setFocus({ ...focus, right: false })}
      />
      <button
        onClick={handleSearch}
        className="absolute right-3 text-black top-1/2 transform -translate-y-1/2"
      >
        <IoIosSearch className="text-2xl text-black" />
      </button>
    </div>
  );
};

export default SearchInput;
