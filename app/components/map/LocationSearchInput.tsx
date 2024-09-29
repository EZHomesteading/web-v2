// LocationSearchInput.tsx
import { LiaMapMarkedSolid } from "react-icons/lia";
import PlacesAutocomplete, {
  Suggestion,
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

interface LocationSearchInputProps {
  address: string;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  onLocationSelect: (latLng: google.maps.LatLngLiteral) => void;
  apiKey: string;
}

const LocationSearchInput: React.FC<LocationSearchInputProps> = ({
  address,
  setAddress,
  onLocationSelect,
  apiKey,
}) => {
  const handleChange = (address: string) => {
    setAddress(address);
  };

  const handleSelect = async (address: string) => {
    try {
      const results = await geocodeByAddress(address);
      const latLng = await getLatLng(results[0]);
      setAddress(address);
      onLocationSelect(latLng);
    } catch (error) {
      console.error("Error", error);
    }
  };

  return (
    <PlacesAutocomplete
      value={address}
      onChange={handleChange}
      onSelect={handleSelect}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps }) => (
        <div>
          <div style={{ position: "relative" }}>
            <LiaMapMarkedSolid className="absolute top-3 left-3" size="3rem" />
            <input
              {...getInputProps({
                placeholder: "Search by address, city, zip, and state",
                className:
                  "peer w-full p-4 pt-6 font-light border-2 rounded-full transition disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none pl-16",
              })}
            />

            <div
              className="autocomplete-dropdown-container"
              style={{
                position: "absolute",
                top: "105%",
                left: 0,
                right: 0,
                zIndex: 1000,
              }}
            >
              {suggestions
                .slice(0, 3)
                .map((suggestion: Suggestion, index: number) => {
                  const className = suggestion.active
                    ? "suggestion-item--active bg-green-100"
                    : "suggestion-item bg-white";
                  const style = {
                    backgroundColor: suggestion.active ? "#fafafa" : "#ffffff",
                    cursor: "pointer",
                    padding: ".5rem",
                    fontSize: "1rem",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  };
                  return (
                    <div
                      {...getSuggestionItemProps(suggestion, {
                        className,
                        style,
                      })}
                      key={suggestion.id || index}
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
  );
};

export default LocationSearchInput;
