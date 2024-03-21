import PlacesAutocomplete, {
  Suggestion,
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { FiMapPin } from "react-icons/fi";

interface LocationSearchInputProps {
  address: string;
  setAddress: (address: string) => void;
  onAddressParsed: (latLng: { lat: number; lng: number } | null) => void;
  onFocus: () => void;
  onBlur: () => void;
  onSearch: () => void;
}

const SearchLocation: React.FC<LocationSearchInputProps> = ({
  address,
  setAddress,
  onAddressParsed,
  onSearch,
}) => {
  const handleChange = (address: string) => {
    setAddress(address);
  };

  const handleSelect = (address: string) => {
    setAddress(address);
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => {
        onAddressParsed(latLng);
      })
      .catch((error) => {
        console.error("Error", error);
        onAddressParsed(null);
      });
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    suggestions: readonly Suggestion[]
  ) => {
    if (e.key === "Enter") {
      if (suggestions.length > 0) {
        const topSuggestion = suggestions[0].description;
        setAddress(topSuggestion);
        handleSelect(topSuggestion);
      } else {
        onSearch();
      }
    }
  };

  return (
    <PlacesAutocomplete
      value={address}
      onChange={handleChange}
      onSelect={handleSelect}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps }) => (
        <div className="relative">
          <FiMapPin className="absolute z-50 left-2 top-1/2 transform -translate-y-1/2 text-lg text-gray-400" />
          <input
            {...getInputProps({
              placeholder: "Everywhere",
              className:
                "rounded-l-full px-4 py-2 pl-8 outline-none transition-all duration-200 border border-black",
            })}
            onKeyDown={(e) => handleKeyDown(e, suggestions)}
          />
          <div className="absolute mt-1 shadow-lg z-10">
            {suggestions.map((suggestion) => {
              const className = suggestion.active
                ? "cursor-pointer"
                : "cursor-pointer";
              return (
                <div
                  {...getSuggestionItemProps(suggestion, {
                    className: `px-4 py-2 ${className}`,
                  })}
                  key={suggestion.id}
                >
                  <span>{suggestion.description}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </PlacesAutocomplete>
  );
};

export default SearchLocation;
