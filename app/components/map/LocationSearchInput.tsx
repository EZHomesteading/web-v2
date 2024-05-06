import Script from "next/script";
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

        onAddressParsed?.({ street, city, state, zip });
      })
      .catch((error) => console.error("Error", error));
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
          <div>
            <div style={{ position: "relative" }}>
              <input
                {...getInputProps({
                  placeholder: "Search by address, city, zip, and state",
                  className:
                    "peer w-full p-4 pt-6 font-light border-2 rounded-md transition disabled:opacity-70 disabled:cursor-not-allowed",
                })}
              />

              <div
                className="autocomplete-dropdown-container"
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  zIndex: 1000,
                }}
              >
                {suggestions.slice(0, 3).map((suggestion: Suggestion) => {
                  const className = suggestion.active
                    ? "suggestion-item--active bg-green-100"
                    : "suggestion-item bg-white";
                  const style = {
                    backgroundColor: suggestion.active ? "#fafafa" : "#ffffff",
                    cursor: "pointer",
                    padding: ".5rem",
                    fontSize: "1rem",
                  };
                  return (
                    <div
                      {...getSuggestionItemProps(suggestion, {
                        className,
                        style,
                      })}
                      key={suggestion.id}
                    >
                      <span>{suggestion.description}</span>
                    </div>
                  );
                })}
              </div>
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

export default LocationSearchInput;
