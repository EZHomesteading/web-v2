import React from "react";
import Script from "next/script";
import PlacesAutocomplete, {
  geocodeByAddress,
} from "react-places-autocomplete";

interface LocationSearchInputProps {
  apiKey: string;
  address: string;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  onAddressParsed: (address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    fullAddress: string;
  }) => void;
}

const LocationSearchInput: React.FC<LocationSearchInputProps> = ({
  apiKey,
  address,
  setAddress,
  onAddressParsed,
}) => {
  const handleChange = (address: string) => {
    setAddress(address);
  };

  const handleSelect = (selectedAddress: string) => {
    geocodeByAddress(selectedAddress)
      .then((results) => {
        const addressComponents = results[0].address_components;
        let street = "";
        let city = "";
        let state = "";
        let zip = "";

        addressComponents.forEach((component) => {
          const types = component.types;
          if (types.includes("street_number")) {
            street += component.long_name + " ";
          }
          if (types.includes("route")) {
            street += component.long_name;
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
        onAddressParsed({
          street: street.trim(),
          city,
          state,
          zip,
          fullAddress: selectedAddress,
        });

        setAddress(street.trim());
      })
      .catch((error) => console.error("Error", error));
  };

  return (
    <>
      <PlacesAutocomplete
        value={address}
        onChange={handleChange}
        onSelect={handleSelect}
        googleCallbackName="initGoogleMaps"
      >
        {({ getInputProps, suggestions, getSuggestionItemProps }) => (
          <div className="w-full max-w-screen sm:max-w-[500px]">
            <div className="relative">
              <input
                {...getInputProps({
                  placeholder: "",
                  className: `
                    peer
                    w-full
                    font-light
                    p-2
                    pt-6
                    bg-inherit
                    border
                    rounded-md
                    outline-none
                    transition
                    disabled:opacity-70
                    disabled:cursor-not-allowed
                    pl-4
                    border-neutral-300
                    focus:border-black
                  `,
                })}
              />
              <label
                className={`
                  absolute
                  text-md
                  duration-150
                  transform
                  -translate-y-3
                  top-5
                  text-sm
                  origin-[0]
                  left-4
                  peer-placeholder-shown:scale-100
                  peer-placeholder-shown:translate-y-0
                  peer-focus:scale-75
                  peer-focus:-translate-y-4
                  text-zinc-400
                `}
              >
                Street Address
              </label>
              <div className="absolute z-10 w-full bg-white shadow-md">
                {suggestions.map((suggestion) => {
                  const className = suggestion.active
                    ? "p-2 bg-gray-100 cursor-pointer"
                    : "p-2 bg-white cursor-pointer";
                  return (
                    <div
                      {...getSuggestionItemProps(suggestion, { className })}
                      key={suggestion.placeId}
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
        src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps`}
        async
        defer
      />
    </>
  );
};

export default LocationSearchInput;
