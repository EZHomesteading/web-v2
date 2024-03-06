import React, { useState } from "react";
import PlacesAutocomplete, { Suggestion } from "react-places-autocomplete";

interface LocationSearchInputProps {
  address: string;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
}

const LocationSearchInput: React.FC<LocationSearchInputProps> = ({
  address,
  setAddress,
}) => {
  const handleChange = (address: string) => {
    setAddress(address);
  };

  const handleSelect = (address: string) => {
    setAddress(address);
    console.log(address);
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
              placeholder: "Search Places ...",
              className: "location-search-input",
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
