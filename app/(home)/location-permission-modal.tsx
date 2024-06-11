"use client";
import { useState, useEffect } from "react";

const LocationPermissionPopup = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const permissionStatus = localStorage.getItem("locationPermissionDenied");
    if (permissionStatus === "true") {
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        localStorage.removeItem("locationPermissionDenied");
      }, 5000);
    }
  }, []);

  if (!showPopup) {
    return null;
  }

  return (
    <div className="fixed top-10 right-0 bg-red-500 text-white px-4 py-2 rounded-l-md shadow-md z-50">
      Location permission denied. Showing all listings.
    </div>
  );
};

export default LocationPermissionPopup;
