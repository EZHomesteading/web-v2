import PlacesAutocomplete, {
  Suggestion,
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { FiMapPin } from "react-icons/fi";
import Script from "next/script";

interface LocationSearchInputProps {
  address: string;
  setAddress: (address: string) => void;
  onAddressParsed: (latLng: { lat: number; lng: number } | null) => void;
  focus: { left: boolean; right: boolean };
  setFocus: (focus: { left: boolean; right: boolean }) => void;
  onSearch: () => void;
}

const SearchLocation: React.FC<LocationSearchInputProps> = ({
  address,
  setAddress,
  onAddressParsed,
  onSearch,
  focus,
  setFocus,
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

    const nextElement = e.currentTarget
      .nextElementSibling as HTMLElement | null;
    if (nextElement && nextElement.tabIndex >= 0) {
      nextElement.focus();
    }
  };

  return (
    <>
      <PlacesAutocomplete
        value={address}
        onChange={handleChange}
        onSelect={handleSelect}
        googleCallbackName="lazyLoadMap"
      >
        {({ getInputProps, suggestions, getSuggestionItemProps }) => (
          <div className="relative">
            <FiMapPin className="absolute text-black z-50 left-2 top-1/2 transform -translate-y-1/2 text-lg " />
            <input
              {...getInputProps({
                placeholder: "Everywhere",
                className:
                  "rounded-md sm:rounded-l-full px-4 py-2 pl-8 border-[.1px] border-black text-black outline-none transition-all duration-200",
              })}
              onKeyDown={(e) => handleKeyDown(e, suggestions)}
              onFocus={() => setFocus({ ...focus, left: true })}
              onBlur={() => setFocus({ ...focus, left: false })}
            />
            <div className="absolute mt-1 text-black shadow-lg z-10 max-w-full rounded-full">
              {suggestions.map((suggestion, index) => {
                const className = suggestion.active
                  ? "cursor-pointer"
                  : "cursor-pointer";
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className: `px-4 py-2 bg-white text-black flex items-center text-xs ${className} text-black rounded-sm mb-[]`,
                    })}
                    key={suggestion.placeId || index}
                  >
                    <span className="overflow-hidden text-black overflow-ellipsis whitespace-nowrap ">
                      {suggestion.description}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
      <Script
        async
        defer
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_MAPS_API_KEY}&loading=async&libraries=places&callback=lazyLoadMap`}
      />
    </>
  );
};

export default SearchLocation;
