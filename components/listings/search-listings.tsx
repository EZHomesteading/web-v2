"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import PlacesAutocomplete, {
  Suggestion,
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import Script from "next/script";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import axios from "axios";
import qs from "query-string";
import { useRouter } from "next/navigation";
import { IoIosSearch } from "react-icons/io";
import debounce from "debounce";
import { PiBasketThin, PiMapTrifoldThin } from "react-icons/pi";
import Fuse from "fuse.js";
import { OutfitFont } from "../fonts";
import { useSearchParams } from "next/navigation";

type Listing = {
  title: string;
  subCategory: string;
};

interface p {
  apiKey: string;
}

const getLatLngFromAddress = async (address: string) => {
  const apiKey = process.env.MAPS_KEY as string;
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

const SearchLocation = ({ apiKey }: p) => {
  const [focus, setFocus] = useState({ left: false, right: false });
  const [address, setAddress] = useState("");
  const params = useSearchParams();
  const validateZipCode = (zip: string): boolean => {
    const zipRegex = /^\d{5}$/;
    return zipRegex.test(zip);
  };

  useEffect(() => {
    const zip = params?.get("zip");
    if (zip) {
      const isValidZip = validateZipCode(zip);
      if (isValidZip) {
        setAddress(zip);
      } else {
        console.warn("Invalid zip code format in URL");
        setAddress("");
      }
    } else {
      setAddress("");
    }
  }, [params]);

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
  const [items, setItems] = useState<Listing[]>([]);
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showListingSuggestions, setShowListingSuggestions] = useState(false);
  const listingInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAllListings = async () => {
      try {
        const response = await fetch(`/api/listing/listingSuggestions`);
        const data = await response.json();
        if (data.listings) {
          setAllListings(data.listings);
        }
      } catch (error) {
        console.error("Error fetching all listings:", error);
      }
    };

    fetchAllListings();
  }, []);

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

  useEffect(() => {
    const formState = getFormState();
    if (formState) {
      setLocation(formState.location);
      setLatLng(formState.latLng);
      setAddress(formState.address);
    }
  }, []);

  const fuse = useMemo(() => {
    const options = {
      keys: ["title", "subCategory"],
      threshold: 0.6,
      distance: 100,
      ignoreLocation: true,
      shouldSort: true,
      minMatchCharLength: 3,
    };
    return new Fuse<Listing>(allListings, options);
  }, [allListings]);

  const handleEnterDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch(searchQuery);
      setShowListingSuggestions(false);
    }
  };

  const handleSearch = async (searchQuery: string) => {
    try {
      let lat: string | null = null;
      let lng: string | null = null;
      let radius: number | null = null;
      if (latLng) {
        lat = latLng.lat.toString();
        lng = latLng.lng.toString();
        radius = 20;
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
          url: "/market",
          query,
        },
        { skipNull: true }
      );
      sessionStorage.removeItem("formState");
      const formState = {
        location,
        latLng,
        address,
      };
      sessionStorage.setItem("formState", JSON.stringify(formState));
      router.push(url);
      setLocation(location);
      setLatLng(latLng);
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

  const handleChange = (address: string) => {
    setAddress(address);
  };

  const getFormState = () => {
    const formState = sessionStorage.getItem("formState");
    return formState ? JSON.parse(formState) : null;
  };

  const handleSelect = (address: string) => {
    setAddress(address);
    setShowSuggestions(false);
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
      e.preventDefault();
      if (suggestions.length > 0) {
        const topSuggestion = suggestions[0].description;
        setAddress(topSuggestion);
        handleSelect(topSuggestion);
      }
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  const preprocessTerm = (term: string) =>
    term
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
      .toLowerCase()
      .trim();

  const removeDuplicates = (listings: Listing[]): Listing[] => {
    const uniqueListings = new Map<string, Listing>();
    listings.forEach((listing) => {
      const key = `${listing.title}`;
      if (!uniqueListings.has(key)) {
        uniqueListings.set(key, listing);
      }
    });
    return Array.from(uniqueListings.values());
  };

  const searchSingleTerm = (term: string): Listing[] => {
    const preprocessedTerm = preprocessTerm(term);
    return fuse.search(preprocessedTerm).map((result) => result.item);
  };

  const searchMultipleTerms = (
    terms: string[],
    originalQuery: string
  ): Listing[] => {
    const preprocessedQuery = preprocessTerm(originalQuery);
    return allListings.filter((listing) => {
      const preprocessedTitle = preprocessTerm(listing.title);
      const preprocessedSubCategory = preprocessTerm(listing.subCategory);

      if (
        preprocessedTitle.includes(preprocessedQuery) ||
        preprocessedSubCategory.includes(preprocessedQuery)
      ) {
        return true;
      }

      return terms.every((term) => {
        const preprocessedTerm = preprocessTerm(term);
        return (
          preprocessedTitle.includes(preprocessedTerm) ||
          preprocessedSubCategory.includes(preprocessedTerm)
        );
      });
    });
  };

  const handleSearchName = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const query = event.target.value;
      if (query === "") {
        setItems([]);
        setShowListingSuggestions(false);
        return;
      }
      setIsSearching(true);
      try {
        const searchTerms = query
          .split(/\s+/)
          .filter((term) => term.length > 0);

        let searchResults;
        if (searchTerms.length === 1) {
          searchResults = searchSingleTerm(searchTerms[0]);
        } else {
          const multiTermResults = searchMultipleTerms(searchTerms, query);
          searchResults =
            multiTermResults.length > 0
              ? multiTermResults
              : searchSingleTerm(query);
        }

        // Ensure duplicates are removed before setting the state
        const uniqueResults = removeDuplicates(searchResults);
        setItems(uniqueResults);
        setShowListingSuggestions(true);
      } catch (error) {
        console.error("Error searching listings:", error);
        setItems([]);
      } finally {
        setIsSearching(false);
      }
    },
    1000
  );

  const handleListingSelect = (item: Listing) => {
    setSearchQuery(item.title);
    setShowListingSuggestions(false);
    handleSearch(item.title);
  };
  return (
    <div
      className={`flex items-center border rounded-full bg-white shadow-[0_0_5px_rgba(0,0,0,0.1)] justify-center relative w-full  ${OutfitFont.className}`}
    >
      <PlacesAutocomplete
        value={address}
        onChange={handleChange}
        onSelect={handleSelect}
        googleCallbackName="lazyLoadMap"
      >
        {({ getInputProps, suggestions, getSuggestionItemProps }) => (
          <div className="relative w-full sm:w-1/2 sm:mb-0">
            <PiMapTrifoldThin className="absolute text-black z-50 left-2 top-1/2 transform -translate-y-1/2 text-2xl" />
            <div className="absolute text-gray-600 z-50 left-9 top-2 font-medium transform text-sm select-none">
              Where
            </div>

            <input
              {...getInputProps({
                ref: inputRef,
                placeholder: "Everywhere",
                className:
                  "w-full rounded-full px-4 pb-2 pt-6 pl-9 border-none placeholder-black !text-black outline-none transition-all duration-200",
                onKeyDown: (e) => handleKeyDown(e, suggestions),
                onFocus: () => {
                  setFocus({ ...focus, left: true });
                  setShowSuggestions(true);
                },
                onBlur: () => {
                  setFocus({ ...focus, left: false });
                  setTimeout(() => setShowSuggestions(false), 200);
                },
              })}
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute mt-1 text-black shadow-lg z-dropdown max-w-full rounded-xl py-3 bg-white border ">
                {suggestions.map((suggestion, index) => {
                  const className = suggestion.active
                    ? "cursor-pointer bg-gray-200"
                    : "cursor-pointer";
                  return (
                    <div
                      {...getSuggestionItemProps(suggestion, {
                        className: `px-4 py-3 flex items-center text-sm ${className} hover:cursor-pointer hover:bg-gray-200`,
                        onClick: () => {
                          handleSelect(suggestion.description);
                          setShowSuggestions(false);
                        },
                      })}
                      key={suggestion.placeId || index}
                    >
                      <span className="overflow-hidden text-black overflow-ellipsis whitespace-nowrap">
                        {suggestion.description}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </PlacesAutocomplete>
      <div className="relative w-full sm:w-1/2 border-l-[1px]">
        <PiBasketThin className="absolute text-black z-50 left-2 top-1/2 transform -translate-y-1/2 text-2xl" />
        <div className="absolute text-gray-600 z-50 left-9 top-2 font-medium transform text-sm select-none">
          What
        </div>
        <input
          ref={listingInputRef}
          type="text"
          placeholder="Everything"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            handleSearchName(e);
          }}
          onKeyDown={handleEnterDown}
          className="w-full rounded-full px-4 pb-2 pt-6 pl-9 placeholder-black border-none text-black outline-none transition-all duration-200"
          onFocus={() => {
            setFocus({ ...focus, right: true });
            setShowListingSuggestions(true);
          }}
          onBlur={() => {
            setFocus({ ...focus, right: false });
            setTimeout(() => setShowListingSuggestions(false), 200);
          }}
          tabIndex={0}
        />
        {showListingSuggestions && items.length > 0 && (
          <div className="absolute bg-white max-w-[910px] h-auto w-full left-0 top-16 rounded-xl border py-3">
            {items.slice(0, 5).map((item: Listing) => (
              <div
                className="p-1 cursor-pointer hover:bg-gray-200"
                key={item.title}
                onMouseDown={() => handleListingSelect(item)}
              >
                <div className="flex items-center justify-between w-full p-1 px-2">
                  {item.title}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <button
        onClick={() => handleSearch(searchQuery)}
        className="absolute right-3 text-black top-1/2 transform -translate-y-1/2"
      >
        <IoIosSearch className="text-2xl text-white bg-black rounded-full p-1" />
      </button>

      <button
        className={`${
          address !== "" && "!hidden"
        } absolute top-full mt-2 py-1 px-4 bg-white border-[1px] h-12 rounded-lg text-grey w-full ${
          focus.left ? "visible" : "hidden"
        }`}
        onMouseDown={handleNearMeClick}
      >
        Near Me
      </button>
      <Script
        async
        defer
        src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&loading=async&libraries=places&callback=lazyLoadMap`}
      />
    </div>
  );
};

export default SearchLocation;
