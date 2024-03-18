"use client";
import { useCallback, useEffect, useState } from "react";
import { APIProvider, useMapsLibrary } from "@vis.gl/react-google-maps";
import { FiMapPin, FiSearch } from "react-icons/fi";
import { BsBasket } from "react-icons/bs";
import SearchClient from "@/app/components/client/SearchClientName";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

interface ProductSelectProps {
  data: any;
}
const Geocoding: React.FC<ProductSelectProps> = ({ data }) => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const geocodingApiLoaded = useMapsLibrary("geocoding");
  const [geocodingService, setGeocodingService] =
    useState<google.maps.Geocoder>();
  const [geocodingResult, setGeocodingResult] =
    useState<google.maps.GeocoderResult>();
  const [address, setAddress] = useState("");

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

  const [focus, setFocus] = useState({ left: false, right: false });

  const handleNearMeClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = `${position.coords.latitude}, ${position.coords.longitude}`;
          setAddress(userLocation);
        },
        (error) => {
          console.error("Error getting location: ", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const params = useSearchParams();
  const onSubmit = useCallback(async () => {
    let currentQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString());
    }
    let updatedQuery: any = {};
    if (location && search) {
      updatedQuery = {
        ...currentQuery,
        location,
        search,
      };
    } else if (search) {
      updatedQuery = {
        ...currentQuery,
        search,
      };
    } else if (location) {
      updatedQuery = {
        ...currentQuery,
        location,
      };
    }
    const url = qs.stringifyUrl(
      {
        url: "/shop",
        query: updatedQuery,
      },
      { skipNull: true }
    );

    router.push(url);
  }, [router, search, params]);

  return (
    <>
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative w-auto flex flex-col items-center space-y-4">
          <div className="flex flex-col sm:flex-row">
            <div className="relative flex items-center mb-2 sm:mb-0">
              <FiMapPin className="absolute z-50 left-2 text-lg text-gray-400" />
              <input
                type="text"
                placeholder="Where?"
                style={{
                  transform: focus.left ? "scale(1.03)" : "scale(1)",
                  zIndex: focus.left ? "20" : "1",
                }}
                className="rounded-r-full sm:rounded-l-full sm:rounded-r-none px-4 py-2 pl-8 outline-none transition-all duration-200 border
              focus:left ? 'bg-white border-black scale-120' : 'bg-gray-100 border-gray-300'"
                onFocus={() => setFocus({ ...focus, left: true })}
                onBlur={() => setFocus({ ...focus, left: false })}
              />
            </div>
            <div className="relative flex items-center">
              <SearchClient
                data={data}
                onChange={(e) => {
                  setSearch(e.value);
                }}
              />
            </div>
            <div></div>
          </div>
          <button
            onClick={handleNearMeClick}
            disabled={focus.right}
            className={`px-4 py-2 ${
              focus.left
                ? "text-black border-[.5px] border-black rounded-lg"
                : "text-white "
            }`}
            style={{ width: "calc(100% - 1rem)" }}
          >
            Near Me
          </button>
        </div>
      </div>
    </>
  );
};

export default Geocoding;
