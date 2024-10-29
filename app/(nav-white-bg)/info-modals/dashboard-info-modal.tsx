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

const DashboardPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(1);
  const nodeRef = useRef(null);

  useEffect(() => {
    const hasVisitedDashboard = localStorage.getItem("hasVisitedDashboard");
    if (!hasVisitedDashboard) {
      setShowPopup(true);
      localStorage.setItem("hasVisitedDashboard", "true");
    }
  }, []);

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
  const router = useRouter();
  const handleContinue = () => {
    setShowPopup(false);
    localStorage.removeItem("hasVisitedMessagePage");
    router.push("/chat");
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
        <h2 className="text-2xl font-bold mb-4">Welcome to Your Dashboard!</h2>
        <p className="mb-4">Here's a quick overview of what you can do:</p>
        <ul className="list-disc list-inside mb-4">
          <li>View your total sales and incoming payouts</li>
          <li>Check your ongoing buy and sell orders</li>
          <li>See your follower count</li>
          <li>View recent purchases and sales</li>
          <li>View your sale history</li>
          <li>And much more!</li>
        </ul>
        <Button
          className="bg-blue-500 text-white hover:bg-blue-600"
          onClick={handleContinue}
        >
          Continue Walkthrough
        </Button>
      </div>
    </Draggable>
  );
};

export default DashboardPopup;
