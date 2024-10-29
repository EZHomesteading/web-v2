"use client";
import { Outfit } from "next/font/google";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/app/components/ui/button";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";
import Draggable from "react-draggable";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});

const LocationPermissionPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(1);
  const router = useRouter();
  const nodeRef = useRef(null);

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

  const handleDrag = (e: any, data: { x: number; y: number }) => {
    setPosition({ x: data.x, y: 0 }); // Only update x position

    // Calculate opacity based on x position
    const newOpacity = Math.max(0, 1 - data.x / 200);
    setOpacity(newOpacity);

    // If dragged more than 150px to the right, dismiss the popup
    if (data.x > 150) {
      setShowPopup(false);
      localStorage.removeItem("locationPermissionDenied");
    }
  };

  if (!showPopup) {
    return null;
  }

  return (
    <Draggable
      nodeRef={nodeRef}
      position={position}
      onDrag={handleDrag}
      axis="x"
    >
      <div
        ref={nodeRef}
        style={{ opacity }}
        className={`
          ${outfit.className}
          fixed top-10 left-2 bg-green-100 text-black px-4 py-2 rounded-xl 
          border-[1px] border-slate-500 shadow-md z-50 cursor-move hover:cursor-pointer
          transition-opacity duration-300 ease-in-out
        `}
      >
        <div>Showing all listings regardless of location.</div>
        <Button
          className="text-xs px-2 bg-slate-500 text-black"
          onClick={() =>
            router.push("/info/how-to/user/reenable-location-permission")
          }
        >
          Reenable Location Permission
        </Button>
      </div>
    </Draggable>
  );
};

export default LocationPermissionPopup;
