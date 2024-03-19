import React from "react";
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
}

const ListingLocationSearch: React.FC<LocationSearchInputProps> = ({
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
      .then((results) => getLatLng(results[0]))
      .then((latLng) => {
        onAddressParsed(latLng);
      })
      .catch((error) => {
        console.error("Error", error);
        onAddressParsed(null);
      });
  };

  return (
    <PlacesAutocomplete
      value={address}
      onChange={handleChange}
      onSelect={handleSelect}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div className="relative">
          <FiMapPin className="absolute z-50 left-2 top-1/2 transform -translate-y-1/2 text-lg text-gray-400" />
          <input
            {...getInputProps({
              placeholder: "Where?",
              className:
                "w-full rounded-r-full sm:rounded-l-full sm:rounded-r-none px-4 py-2 pl-8 outline-none transition-all duration-200 border focus:left ? 'bg-white border-black scale-120' : 'bg-gray-100 border-gray-300'",
            })}
          />
          <div className="absolute mt-1 w-full bg-white shadow-lg z-10">
            {loading && <div>Loading...</div>}
            {suggestions.map((suggestion) => {
              const className = suggestion.active
                ? "bg-gray-200 cursor-pointer"
                : "bg-white cursor-pointer";
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

export default ListingLocationSearch;
