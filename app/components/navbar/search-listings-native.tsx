"use client";
import PlacesAutocomplete, {
  Suggestion,
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { FiMapPin } from "react-icons/fi";
import Script from "next/script";
import { useEffect, useState } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import axios from "axios";
import qs from "query-string";
import { useRouter } from "next/navigation";
import { BsBasket } from "react-icons/bs";
import { IoIosSearch } from "react-icons/io";

const getLatLngFromAddress = async (address: string) => {
  const apiKey = process.env.NEXT_PUBLIC_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${apiKey}&loading=async&libraries=places`;

  try {
    const response = await axios.get(url);
    if (response.data.status === "OK") {
      const { lat, lng } = response.data.results[0].geometry.location;
      return { lat, lng };
    } else {
      throw new Error("Geocoding failed");
    }
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
};

const SearchLocation = ({ onClose }: any) => {
  const [focus, setFocus] = useState({ left: false, right: false });
  const [address, setAddress] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [geocodingService, setGeocodingService] =
    useState<google.maps.Geocoder>();
  const [geocodingResult, setGeocodingResult] =
    useState<google.maps.GeocoderResult>();
  const geocodingApiLoaded = useMapsLibrary("geocoding");
  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(
    null
  );

  const router = useRouter();
  const handleEnterDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  const handleSearch = async () => {
    try {
      let lat: string | null = null;
      let lng: string | null = null;
      let radius: number | null = null;
      if (latLng) {
        lat = latLng.lat.toString();
        lng = latLng.lng.toString();
        radius = 32.2;
      } else if (location) {
        const geoData = await getLatLngFromAddress(location);
        radius = 20;
        if (geoData) {
          lat = geoData.lat.toString();
          lng = geoData.lng.toString();
        }
      }

      const query: Record<string, string | undefined> = {
        ...(searchQuery ? { q: searchQuery } : {}),
        ...(lat ? { lat: lat.toString() } : {}),
        ...(lng ? { lng: lng.toString() } : {}),
        ...(radius ? { radius: radius.toString() } : {}),
      };

      const url = qs.stringifyUrl(
        {
          url: "/shop",
          query,
        },
        { skipNull: true }
      );
      sessionStorage.removeItem("formState");
      const saveFormState = () => {
        const formState = {
          location,
          latLng,
        };
        sessionStorage.setItem("formState", JSON.stringify(formState));
      };
      saveFormState();
      router.push(url);
      setSearchQuery("");
      setLocation(location);
      setLatLng(latLng);
      onClose();
    } catch (error) {
      console.error("Error searching listings:", error);
    }
  };

  const handleNearMeClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLatLng({ lat, lng });
          setAddress("Near Me");
          setFocus({ left: false, right: true });
        },

        (error) => {
          console.error("Error getting location: ", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const handleAddressParsed = (latLng: { lat: number; lng: number } | null) => {
    setLatLng(latLng);
  };
  useEffect(() => {
    if (!geocodingApiLoaded) return;
    setGeocodingService(new window.google.maps.Geocoder());
  }, [geocodingApiLoaded]);
  useEffect(() => {
    if (!geocodingService || !address) return;
    geocodingService.geocode({ address }, (results, status) => {
      if (results && status === "OK") {
        setGeocodingResult(results[0]);
      }
    });
  }, [geocodingService, address]);

  const handleChange = (address: string) => {
    setAddress(address);
  };

  const getFormState = () => {
    const formState = sessionStorage.getItem("formState");
    return formState ? JSON.parse(formState) : null;
  };
  useEffect(() => {
    const formState = getFormState();
    if (formState) {
      setLocation(formState.location);
      setLatLng(formState.latLng);
    }
  }, []);
  const handleSelect = (address: string) => {
    setAddress(address);
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => {
        handleAddressParsed(latLng);
      })
      .catch((error) => {
        console.error("Error", error);
        handleAddressParsed(null);
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
      }
    }

    const nextElement = e.currentTarget
      .nextElementSibling as HTMLElement | null;
    if (nextElement && nextElement.tabIndex >= 0) {
      nextElement.focus();
    }
  };

  return (
    <div
      className={`flex flex-col sm:flex-row items-start md:items-center justify-center relative`}
    >
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
      <div className="w-full mb-2 sm:mb-0 sm:w-auto">
        <div className="relative flex items-center mb-2 sm:mb-0 ">
          <BsBasket className="absolute text-black text-lg left-2" />
          <input
            type="text"
            placeholder="Everything"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleEnterDown}
            className="rounded-md text-black sm:rounded-r-full px-4 py-2 pl-8 outline-none transition-all border-[.1px] border-black duration-200"
            onFocus={() => setFocus({ ...focus, right: true })}
            onBlur={() => setFocus({ ...focus, right: false })}
            tabIndex={0}
          />
          <button
            onClick={handleSearch}
            className="absolute right-3 text-black top-1/2 transform -translate-y-1/2"
          >
            <IoIosSearch className="text-2xl text-black" />
          </button>
        </div>
      </div>
      <button
        className={`absolute top-full mt-2 py-1 px-4 border-[1px] rounded-lg text-grey w-full ${
          focus.left ? "visible" : "hidden"
        }`}
        onMouseDown={handleNearMeClick}
      >
        Near Me
      </button>
      <Script
        async
        defer
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_MAPS_API_KEY}&loading=async&libraries=places&callback=lazyLoadMap`}
      />
    </div>
  );
};

export default SearchLocation;
