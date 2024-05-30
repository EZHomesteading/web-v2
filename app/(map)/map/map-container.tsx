// map-container.tsx
"use client";
import Map from "@/app/(map)/map/map";

interface p {
  initialLocation: any;
  coops: any;
  producers: any;
}

const MapContainer = ({ initialLocation, coops, producers }: p) => {
  //   const [userLocation, setUserLocation] = useState<any>(null);

  //   useEffect(() => {
  //     const handlePermissionChange = (event: any) => {
  //       if (event.data.type === "permission-status-change") {
  //         getCurrentPosition();
  //       }
  //     };

  //     const getCurrentPosition = () => {
  //       navigator.geolocation.getCurrentPosition(
  //         (position) => {
  //           setUserLocation({
  //             lat: position.coords.latitude,
  //             lng: position.coords.longitude,
  //           });
  //         },
  //         (error) => {
  //           console.error("Error retrieving location:", error);
  //           setUserLocation(initialLocation);
  //         }
  //       );
  //     };

  //     if (initialLocation && initialLocation.lat && initialLocation.lng) {
  //       setUserLocation(initialLocation);
  //     } else {
  //       getCurrentPosition();
  //     }

  //     window.addEventListener("message", handlePermissionChange);

  //     return () => {
  //       window.removeEventListener("message", handlePermissionChange);
  //     };
  //   }, [initialLocation]);

  //   const coordinates = userLocation || initialLocation;
  //   console.log(userLocation);
  //   console.log(initialLocation);
  return (
    <Map coordinates={initialLocation} coops={coops} producers={producers} />
  );
};

export default MapContainer;
