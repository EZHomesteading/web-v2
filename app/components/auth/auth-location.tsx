import PlacesAutocomplete, {
  Suggestion,
  geocodeByAddress,
} from "react-places-autocomplete";
import { FiMapPin } from "react-icons/fi";
import Script from "next/script";

interface LocationSearchInputProps {
  address: string;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  onAddressParsed?: (address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  }) => void;
}

const SearchLocation: React.FC<LocationSearchInputProps> = ({
  address,
  setAddress,
  onAddressParsed,
}) => {
  const handleChange = (address: string) => {
    setAddress(address);
  };

  const handleSelect = (address: string) => {
    setAddress(address);
    geocodeByAddress(address)
      .then((results) => {
        const addressComponents = results[0].address_components;
        let street = "";
        let city = "";
        let state = "";
        let zip = "";

        addressComponents.forEach((component) => {
          const types = component.types;
          if (types.includes("street_number")) {
            street += component.long_name;
          }
          if (types.includes("route")) {
            street += (street ? " " : "") + component.long_name;
          }
          if (types.includes("locality")) {
            city = component.long_name;
          }
          if (types.includes("administrative_area_level_1")) {
            state = component.short_name;
          }
          if (types.includes("postal_code")) {
            zip = component.long_name;
          }
        });

        onAddressParsed?.({ street, city, state, zip });
      })
      .catch((error) => console.error("Error", error));
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
        handleSelect(address);
      }
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
          <div className="relative bg-transparent">
            <FiMapPin className="absolute z-50 left-2 top-1/2 transform -translate-y-1/2 text-lg" />
            <input
              {...getInputProps({
                placeholder: "123 Main St, City, State, Zip Code",
                className: "rounded-md px-4 py-1 pl-8",
              })}
              onKeyDown={(e) => handleKeyDown(e, suggestions)}
            />
            <div className="absolute mt-1 shadow-lg z-10 max-w-full rounded-full ">
              {suggestions.map((suggestion) => {
                const className = suggestion.active
                  ? "cursor-pointer"
                  : "cursor-pointer";
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className: `px-4 py-2 bg-white flex items-center text-xs ${className} text-black rounded-sm mb-[]`,
                    })}
                    key={suggestion.id}
                  >
                    <span className="overflow-hidden overflow-ellipsis whitespace-nowrap ">
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
