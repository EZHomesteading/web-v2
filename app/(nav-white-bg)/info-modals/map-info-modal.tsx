"use client";

import { Outfit } from "next/font/google";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { XMarkIcon } from "@heroicons/react/20/solid";
import Draggable from "react-draggable";
import { useRouter } from "next/navigation";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});

const MapPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(1);
  const nodeRef = useRef(null);

  useEffect(() => {
    const hasVisitedMapPage = localStorage.getItem("hasVisitedMapPage");
    if (!hasVisitedMapPage) {
      setShowPopup(true);
      localStorage.setItem("hasVisitedMapPage", "true");
    }
  }, []);
  const router = useRouter();
  const handleContinue = () => {
    setShowPopup(false);
    localStorage.removeItem("hasVisitedDashboard");
    router.push("/dashboard");
  };
  const handleDrag = (e: any, data: any) => {
    setPosition({ x: data.x, y: 0 });
    const newOpacity = Math.max(0, 1 - data.x / 200);
    setOpacity(newOpacity);

    if (data.x > 150) {
      setShowPopup(false);
    }
  };

  const handleClose = () => {
    setShowPopup(false);
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
          fixed top-20 left-2 bg-white text-black px-6 py-4 rounded-xl 
          border-[1px] border-slate-300 shadow-lg z-50 cursor-move
          transition-opacity duration-300 ease-in-out max-w-md
        `}
      >
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold mb-4">Welcome to the EZH Map</h2>
        <p className="mb-4">Here's how it works:</p>
        <ul className="list-disc list-inside mb-4">
          <li>Blue markers are Co-ops & green markers are producers</li>
          <li>
            Click on a marker to see their rating, items in stock, and to go to
            their store
          </li>
          <li>
            Click start drawing to free-hand outline an area, vendors not inside
            your shape will be hidden
          </li>
        </ul>
        <div className="grid grid-cols-2 gap-x-4">
          <Button
            className="bg-blue-500 text-white hover:bg-blue-600 col-span-1"
            onClick={handleContinue}
          >
            Restart Walkthrough
          </Button>
          <Button
            className="bg-blue-500 text-white hover:bg-blue-600 col-span-1"
            onClick={handleClose}
          >
            I've Got It!{" "}
          </Button>
        </div>
      </div>
    </Draggable>
  );
};

export default MapPopup;
