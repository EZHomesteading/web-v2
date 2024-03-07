import PlacesAutocomplete, {
  Suggestion,
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

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

const LocationSearchInput: React.FC<LocationSearchInputProps> = ({
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

        console.log(city, zip, street, state);
        onAddressParsed?.({ street, city, state, zip });
      })
      .catch((error) => console.error("Error", error));
  };

  return (
    <PlacesAutocomplete
      value={address}
      onChange={handleChange}
      onSelect={handleSelect}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps }) => (
        <div>
          <input
            {...getInputProps({
              placeholder: "Search by address, city, zip, and state",
              className:
                "peer w-full p-4 pt-6 font-light border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed",
            })}
          />
          <div className="autocomplete-dropdown-container">
            {suggestions.map((suggestion: Suggestion) => {
              const className = suggestion.active
                ? "suggestion-item--active"
                : "suggestion-item";
              // inline style for demonstration purpose
              const style = suggestion.active
                ? {
                    backgroundColor: "#fafafa",
                    cursor: "pointer",
                    // innerWidth: 50,
                  }
                : { backgroundColor: "#ffffff", cursor: "pointer" };
              return (
                <div
                  {...getSuggestionItemProps(suggestion, {
                    className,
                    style,
                  })}
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

export default LocationSearchInput;
