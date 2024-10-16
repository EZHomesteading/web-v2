import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import { useState, useEffect, useRef, useCallback } from "react";
import Loading from "@/app/components/secondary-loader";
import { Libraries } from "@googlemaps/js-api-loader";
import { LocationObj, UserInfo } from "@/next-auth";
import { Outfit } from "next/font/google";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
  Suggestion,
} from "react-places-autocomplete";
import { LiaMapMarkedSolid } from "react-icons/lia";
import { UserRole } from "@prisma/client";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});

interface Props {
  role?: UserRole;
  location?: LocationObj;
  apiKey: string;
  updateFormData: (data: Partial<{ location: LocationObj }>) => void;
}

const libraries: Libraries = ["places", "drawing", "geometry"];

const StepThree: React.FC<Props> = ({
  updateFormData,
  apiKey,
  role,
  location,
}) => {
  const [address, setAddress] = useState("");
  const [currentCenter, setCurrentCenter] = useState<google.maps.LatLngLiteral>(
    location?.coordinates
      ? {
          lat: location.coordinates[1],
          lng: location.coordinates[0],
        }
      : { lat: 38, lng: -79 }
  );
  const [zoom, setZoom] = useState(6);

  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: libraries,
    version: "3.58",
  });

  const handleLocationSelect = useCallback(
    (latLng: google.maps.LatLngLiteral) => {
      setCurrentCenter(latLng);
      setZoom(15);
    },
    []
  );

  const mapOptions: google.maps.MapOptions = {
    center: currentCenter,
    zoom: zoom,
    mapId: "86bd900426b98c0a",
    zoomControl: false,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    keyboardShortcuts: false,
    clickableIcons: true,
    disableDefaultUI: true,
    maxZoom: 13,
    scrollwheel: true,
    minZoom: 4,
    gestureHandling: "greedy",
  };

  useEffect(() => {
    const disableDefaultTouchBehavior = (event: TouchEvent) => {
      event.preventDefault();
    };

    window.addEventListener("touchmove", disableDefaultTouchBehavior, {
      passive: false,
    });

    return () => {
      window.removeEventListener("touchmove", disableDefaultTouchBehavior);
    };
  }, []);

  const handleChange = (address: string) => {
    setAddress(address);
  };

  const handleSelect = async (selectedAddress: string) => {
    try {
      const results = await geocodeByAddress(selectedAddress);
      const latLng = await getLatLng(results[0]);

      const addressComponents = results[0].address_components;
      const street = [
        addressComponents.find((component) =>
          component.types.includes("street_number")
        )?.long_name,
        addressComponents.find((component) => component.types.includes("route"))
          ?.long_name,
      ]
        .filter((part): part is string => !!part)
        .join(" ");
      const city = addressComponents.find((component) =>
        component.types.includes("locality")
      )?.long_name;
      const state = addressComponents.find((component) =>
        component.types.includes("administrative_area_level_1")
      )?.short_name;
      const zip = addressComponents.find((component) =>
        component.types.includes("postal_code")
      )?.long_name;

      const locationObj: LocationObj = {
        isDefault: null,
        role: role ? role : "PRODUCER",
        type: "Point",
        coordinates: [latLng.lng, latLng.lat],
        address: [street, city, state, zip].filter(
          (part): part is string => !!part
        ),
        hours: null,
      };
      updateFormData({ location: locationObj });
      setAddress(selectedAddress);
      handleLocationSelect(latLng);
    } catch (error) {
      console.error("Error selecting address:", error);
    }
  };

  if (!isLoaded) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-center pt-[2%] sm:pt-[5%] text-4xl">
        Location Setup
      </div>
      <h1 className={`${outfit.className} text-xl sm:text-2xl mb-5`}>
        Add your First Selling Location. Users can have up to Three Selling
        Locations
      </h1>

      <div className={`relative touch-none`}>
        <div className="absolute z w-full px-2 top-5">
          <PlacesAutocomplete
            value={address}
            onChange={handleChange}
            onSelect={handleSelect}
          >
            {({ getInputProps, suggestions, getSuggestionItemProps }) => (
              <div>
                <div style={{ position: "relative" }}>
                  <LiaMapMarkedSolid
                    className="absolute top-3 left-3"
                    size="3rem"
                  />
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
                          backgroundColor: suggestion.active
                            ? "#fafafa"
                            : "#ffffff",
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
        </div>
        <GoogleMap
          onLoad={(map) => {
            mapRef.current = map;
          }}
          mapContainerClassName="sm:h-[550px] sm:w-[400px] h-[400px] w-[300px] rounded-lg shadow-lg"
          options={mapOptions}
        >
          <MarkerF position={currentCenter} />
        </GoogleMap>
      </div>
    </div>
  );
};

export default StepThree;
