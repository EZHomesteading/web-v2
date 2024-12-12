"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  GoogleMap,
  MarkerF,
  useLoadScript,
  DirectionsRenderer,
  Autocomplete,
} from "@react-google-maps/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { outfitFont } from "@/components/fonts";
import { OrderMap } from "./page";
import { Navigation } from "lucide-react"; // Import navigation icon
import { OverlayView } from "@react-google-maps/api";
const libraries: ("places" | "geometry")[] = ["places", "geometry"];

interface FixedRouteOptimizerProps {
  orders: OrderMap[];
  googleMapsApiKey: string;
  initialLocation: {
    lat: number;
    lng: number;
  };
}

interface RouteSegment {
  order: OrderMap;
  travelTime: number;
  distance: number;
}

const RouteOptimizer = ({
  orders,
  googleMapsApiKey,
  initialLocation,
}: FixedRouteOptimizerProps) => {
  // Previous state management code remains the same
  const [userLocation, setUserLocation] = useState<google.maps.LatLng | null>(
    null
  );
  const [endLocation, setEndLocation] = useState<google.maps.LatLng | null>(
    null
  );
  const [zoom, setZoom] = useState(12);
  const [optimizedRoute, setOptimizedRoute] = useState<OrderMap[]>([]);
  const [routeSegments, setRouteSegments] = useState<RouteSegment[]>([]);
  const [mapKey, setMapKey] = useState(0);
  const [useCustomEndLocation, setUseCustomEndLocation] = useState(false);
  const [addressSearch, setAddressSearch] = useState("");
  const [customEndLocation, setCustomEndLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [startLocationAddress, setStartLocationAddress] = useState<string>("");

  // Refs and utility functions remain the same
  const mapRef = useRef<google.maps.Map | null>(null);
  const searchBoxRef = useRef<google.maps.places.Autocomplete | null>(null);

  const metersToMiles = (meters: number): number => {
    return meters * 0.000621371;
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours} hr ${minutes} min` : `${minutes} min`;
  };
  const openInMaps = () => {
    if (!optimizedRoute.length || !userLocation) return;

    const waypoints = optimizedRoute
      .map(
        (order) =>
          `${order.location.coordinates[1]},${order.location.coordinates[0]}`
      )
      .join("|");

    const destination = endLocation
      ? `${endLocation.lat()},${endLocation.lng()}`
      : `${userLocation.lat()},${userLocation.lng()}`;

    const origin = `${userLocation.lat()},${userLocation.lng()}`;

    // Check if user is on iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    let mapsUrl;
    if (isIOS) {
      // Format URL for Apple Maps
      // Uses daddr for first stop and +to: for additional stops
      const stops = waypoints.split("|");
      let appleMapsUrl = `http://maps.apple.com/?saddr=${origin}&daddr=${stops[0]}`;

      // Add all remaining stops
      for (let i = 1; i < stops.length; i++) {
        appleMapsUrl += `+to:${stops[i]}`;
      }

      // Add final destination if different from last stop
      if (destination !== stops[stops.length - 1]) {
        appleMapsUrl += `+to:${destination}`;
      }

      mapsUrl = appleMapsUrl;
    } else {
      // Format URL for Google Maps
      mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${waypoints}&travelmode=driving`;
    }

    window.open(mapsUrl, "_blank");
  };
  // Get address from coordinates using Geocoding service
  const getAddressFromCoordinates = async (location: google.maps.LatLng) => {
    const geocoder = new google.maps.Geocoder();
    try {
      const response = await geocoder.geocode({ location: location.toJSON() });
      if (response.results[0]) {
        return response.results[0].formatted_address;
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }
    return "Address not found";
  };
  const { isLoaded } = useLoadScript({
    googleMapsApiKey,
    libraries,
  });

  useEffect(() => {
    if (!isLoaded || !userLocation) return;

    // Get and set the start location address when userLocation changes
    getAddressFromCoordinates(userLocation).then((address) => {
      setStartLocationAddress(address);
    });
  }, [isLoaded, userLocation]);
  const clearMap = () => {
    setMapKey((prev) => prev + 1);
    setOptimizedRoute([]);
    setRouteSegments([]);
    setDirections(null);
  };
  useEffect(() => {
    if (!isLoaded || !userLocation || orders.length === 0) return;

    // Wait a bit for everything to initialize properly
    const timer = setTimeout(() => {
      calculateRoute();
    }, 1000);

    return () => clearTimeout(timer);
  }, [isLoaded, userLocation, orders]);
  const onPlaceSelected = (place: google.maps.places.PlaceResult) => {
    if (place.geometry?.location) {
      const newLocation = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };

      setCustomEndLocation(newLocation);
      setEndLocation(new google.maps.LatLng(newLocation.lat, newLocation.lng));
      setAddressSearch(place.formatted_address || "");

      if (mapRef.current) {
        mapRef.current.panTo(newLocation);
        mapRef.current.setZoom(15);
      }
    }
  };

  const calculateRoute = async () => {
    if (!userLocation || orders.length === 0) return;
    clearMap();

    try {
      // Sort orders by pickup time
      const sortedOrders = [...orders].sort(
        (a, b) => a.pickupDate.getTime() - b.pickupDate.getTime()
      );

      const directionsService = new google.maps.DirectionsService();
      const segments: RouteSegment[] = [];

      // Create waypoints array
      const waypoints = sortedOrders.map((order) => ({
        location: new google.maps.LatLng(
          order.location.coordinates[1],
          order.location.coordinates[0]
        ),
        stopover: true,
      }));

      // Calculate route with real directions
      const directionsResult = await directionsService.route({
        origin: userLocation,
        destination: endLocation || userLocation,
        waypoints: waypoints,
        optimizeWaypoints: false, // Keep order based on pickup times
        travelMode: google.maps.TravelMode.DRIVING,
      });

      // Process route segments
      let totalDistance = 0;
      let totalTime = 0;

      directionsResult.routes[0].legs.forEach((leg, index) => {
        const segment: RouteSegment = {
          order: sortedOrders[index] || sortedOrders[sortedOrders.length - 1],
          travelTime: leg.duration?.value || 0,
          distance: leg.distance?.value || 0,
        };
        segments.push(segment);
        totalDistance += leg.distance?.value || 0;
        totalTime += leg.duration?.value || 0;
      });

      setOptimizedRoute(sortedOrders);
      setRouteSegments(segments);
      setDirections(directionsResult);
    } catch (error) {
      console.error("Route calculation error:", error);
    }
  };

  // Map Event Handlers
  const onMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    setZoom(map.getZoom() || 12);
  };

  const onZoomChanged = () => {
    if (mapRef.current) {
      setZoom(mapRef.current.getZoom() || 12);
    }
  };

  useEffect(() => {
    if (!isLoaded) return;

    setUserLocation(
      new google.maps.LatLng(initialLocation.lat, initialLocation.lng)
    );

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation(
            new google.maps.LatLng(
              position.coords.latitude,
              position.coords.longitude
            )
          );
        },
        (error) => {
          console.error("Error getting location:", error);
          setUserLocation(
            new google.maps.LatLng(initialLocation.lat, initialLocation.lng)
          );
        }
      );
    }
  }, [isLoaded, initialLocation]);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="relative h-[calc(100vh-64px)]">
      <Card className="absolute top-4 left-4 z-10 w-96">
        <CardHeader>
          <CardTitle className={outfitFont.className}>Route Overview</CardTitle>
        </CardHeader>
        <CardContent className="overflow-y-auto max-h-[calc(100vh-128px-2rem)]">
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                className={`${outfitFont.className} flex items-center gap-2`}
              >
                <Switch
                  checked={useCustomEndLocation}
                  onCheckedChange={(checked) => {
                    setUseCustomEndLocation(checked);
                    if (!checked) {
                      setEndLocation(null);
                      setCustomEndLocation(null);
                      setAddressSearch("");
                    }
                  }}
                />
                <span>Different End Location</span>
              </label>

              {useCustomEndLocation && (
                <div className="space-y-2">
                  <Label>End Location Address</Label>
                  <Autocomplete
                    onLoad={(autocomplete) => {
                      searchBoxRef.current = autocomplete;
                    }}
                    onPlaceChanged={() => {
                      if (searchBoxRef.current) {
                        const place = searchBoxRef.current.getPlace();
                        onPlaceSelected(place);
                      }
                    }}
                    options={{
                      componentRestrictions: { country: "us" },
                      fields: ["formatted_address", "geometry", "name"],
                      types: ["address"],
                    }}
                  >
                    <Input
                      type="text"
                      placeholder="Enter an address..."
                      className="w-full"
                      value={addressSearch}
                      onChange={(e) => setAddressSearch(e.target.value)}
                    />
                  </Autocomplete>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={calculateRoute}
                disabled={orders.length === 0}
              >
                Calculate Route
              </Button>

              <Button
                className="flex items-center gap-2"
                onClick={openInMaps}
                disabled={optimizedRoute.length === 0}
                variant="outline"
              >
                <Navigation className="w-4 h-4" />
                Open in Maps
              </Button>
            </div>
            {optimizedRoute.length > 0 && (
              <div className="p-2 bg-slate-100 rounded-md space-y-4">
                <div className="border-b pb-2">
                  <p className={`${outfitFont.className} font-medium text-lg`}>
                    Route Details
                  </p>
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <p className={`${outfitFont.className} font-medium`}>
                      Start Location:
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {startLocationAddress}
                    </p>
                    <p>
                      Suggested Departure time:{" "}
                      {routeSegments[0]
                        ? new Date(
                            optimizedRoute[0].pickupDate.getTime() -
                              routeSegments[0].travelTime * 1000 -
                              300000
                          ).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })
                        : "N/A"}
                    </p>
                    <p>
                      Total Distance:{" "}
                      {metersToMiles(
                        routeSegments.reduce(
                          (acc, segment) => acc + segment.distance,
                          0
                        )
                      ).toFixed(1)}{" "}
                      miles
                    </p>
                    <p>
                      Total Travel Time:{" "}
                      {formatDuration(
                        routeSegments.reduce(
                          (acc, segment) => acc + segment.travelTime,
                          0
                        )
                      )}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className={`${outfitFont.className} font-medium`}>
                    Stops:
                  </p>
                  {optimizedRoute.map((order, index) => (
                    <div
                      key={order.id}
                      className="flex flex-col space-y-1 pb-2 border-b last:border-b-0"
                    >
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {index + 1}. {order.location.displayName}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Pickup Time:</span>
                          <span className="text-blue-600 font-medium">
                            {formatTime(order.pickupDate)}
                          </span>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600 pl-6 space-y-0.5">
                        {routeSegments[index] && (
                          <>
                            <div className="flex justify-between">
                              <span>
                                {index === 0
                                  ? "Travel Time from start:"
                                  : "Travel Time from last stop:"}
                              </span>
                              <span>
                                {formatDuration(
                                  routeSegments[index].travelTime
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Distance from last stop:</span>
                              <span>
                                {metersToMiles(
                                  routeSegments[index].distance
                                ).toFixed(1)}{" "}
                                miles
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* End Location Display (if different from start) */}
                  {useCustomEndLocation && customEndLocation && (
                    <div className="flex flex-col space-y-1 pb-2 border-t pt-2">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            Final Destination:
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{addressSearch}</p>
                        {routeSegments[routeSegments.length - 1] && (
                          <div className="text-sm text-gray-600 space-y-0.5 mt-1">
                            <div className="flex justify-between">
                              <span>Travel time from last stop:</span>
                              <span>
                                {formatDuration(
                                  routeSegments[routeSegments.length - 1]
                                    .travelTime
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Distance from last stop:</span>
                              <span>
                                {metersToMiles(
                                  routeSegments[routeSegments.length - 1]
                                    .distance
                                ).toFixed(1)}{" "}
                                miles
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <GoogleMap
        key={mapKey}
        onLoad={onMapLoad}
        onZoomChanged={onZoomChanged}
        mapContainerClassName="w-full h-full"
        center={userLocation ?? undefined}
        zoom={12}
        options={{
          zoomControl: true,
          maxZoom: 16,
          minZoom: 9,
          streetViewControl: false,
          mapTypeControl: false,
          scaleControl: true,
          fullscreenControl: false,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        }}
      >
        {userLocation && (
          <MarkerF
            position={userLocation}
            icon={{
              url: "/icons/clipart2825061.png",
              scaledSize: new google.maps.Size(64, 76),
            }}
            title="Start Location"
          />
        )}

        {customEndLocation && (
          <MarkerF
            position={
              new google.maps.LatLng(
                customEndLocation.lat,
                customEndLocation.lng
              )
            }
            icon={{
              url: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
              scaledSize: new google.maps.Size(32, 32),
            }}
            title="End Location"
          />
        )}

        {orders.map((order) => (
          <React.Fragment key={order.id}>
            <MarkerF
              position={
                new google.maps.LatLng(
                  order.location.coordinates[1],
                  order.location.coordinates[0]
                )
              }
              icon={{
                url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
                scaledSize: new google.maps.Size(32, 32),
              }}
            />
            <OverlayView
              position={
                new google.maps.LatLng(
                  order.location.coordinates[1],
                  order.location.coordinates[0]
                )
              }
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <div className="x-2 py-1 rounded -mt-12 text-sm font-medium whitespace-nowrap max-w-[200px] text-center absolute transform -translate-x-1/2">
                {order.location.displayName}
              </div>
            </OverlayView>
          </React.Fragment>
        ))}

        {/* Render the actual road routes */}
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: true, // We're showing our own custom markers
              polylineOptions: {
                strokeColor: "#4A90E2",
                strokeOpacity: 0.8,
                strokeWeight: 4,
              },
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
};

export default RouteOptimizer;
