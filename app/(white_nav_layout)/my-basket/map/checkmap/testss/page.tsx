interface OSRMResponse {
  code: string;
  routes: {
    duration: number;
    distance: number;
    geometry: {
      coordinates: [number, number][];
    };
  }[];
}

const RouteOptimizer = ({
  orders,
  googleMapsApiKey,
  initialLocation,
}: FixedRouteOptimizerProps) => {
  // ... existing state ...
  const [useGoogleFallback, setUseGoogleFallback] = useState(false);

  const calculateOSRMRoute = async () => {
    if (!userLocation || orders.length === 0) return;
    clearMap();

    try {
      const sortedOrders = [...orders].sort(
        (a, b) => a.pickupDate.getTime() - b.pickupDate.getTime()
      );

      // Format coordinates for OSRM
      const coordinates = [
        `${userLocation.lng()},${userLocation.lat()}`, // start
        ...sortedOrders.map(
          (order) =>
            `${order.location.coordinates[0]},${order.location.coordinates[1]}`
        ),
        endLocation
          ? `${endLocation.lng()},${endLocation.lat()}`
          : `${userLocation.lng()},${userLocation.lat()}`, // end
      ].join(";");

      // Call OSRM service
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&alternatives=false&steps=true`
      );

      const data: OSRMResponse = await response.json();

      if (data.code !== "Ok") {
        throw new Error("OSRM route calculation failed");
      }

      // Convert OSRM response to Google Maps format for display
      const path = data.routes[0].geometry.coordinates.map(
        ([lng, lat]) => new google.maps.LatLng(lat, lng)
      );

      // Create a synthetic DirectionsResult
      const syntheticDirections = {
        routes: [
          {
            legs: sortedOrders.map((order, index) => ({
              distance: {
                value: data.routes[0].distance / sortedOrders.length,
              },
              duration: {
                value: data.routes[0].duration / sortedOrders.length,
              },
            })),
            overview_path: path,
          },
        ],
      } as google.maps.DirectionsResult;

      setDirections(syntheticDirections);
      setOptimizedRoute(sortedOrders);

      // Process segments similar to Google implementation
      const segments: RouteSegment[] = sortedOrders.map((order, index) => ({
        order,
        travelTime: data.routes[0].duration / sortedOrders.length,
        distance: data.routes[0].distance / sortedOrders.length,
      }));

      setRouteSegments(segments);
    } catch (error) {
      console.error("OSRM calculation failed, falling back to Google:", error);
      setUseGoogleFallback(true);
      calculateGoogleRoute(); // Your existing calculateRoute function renamed
    }
  };

  // Modify your existing calculateRoute to check for fallback
  const calculateRoute = async () => {
    if (useGoogleFallback) {
      await calculateGoogleRoute();
    } else {
      await calculateOSRMRoute();
    }
  };

  // ... rest of your component ...
};
