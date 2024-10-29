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

const MessagesPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(1);
  const nodeRef = useRef(null);

  useEffect(() => {
    const hasVisitedMessagePage = localStorage.getItem("hasVisitedMessagePage");
    if (!hasVisitedMessagePage) {
      setShowPopup(true);
      localStorage.setItem("hasVisitedMessagePage", "true");
    }
  }, []);
  const router = useRouter();
  const handleContinue = () => {
    setShowPopup(false);
    localStorage.removeItem("hasVisitedCreatePage");
    router.push("/create");
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
        <h2 className="text-2xl font-bold mb-4">Welcome to EZH Messaging</h2>
        <p className="mb-4">Here's a quick overview of how it works:</p>
        <ul className="list-disc list-inside mb-4">
          <li>
            Buyers automatically message you with their preferred pickup time
            based on your listed hours.
          </li>
          <li>You can confirm, reschedule, or deny the order.</li>
          <li>
            Confirmation means the order will be ready at the specified time and
            location.
          </li>
          <li>
            Rescheduling allows the buyer to accept, deny, or propose a new
            time.
          </li>
          <li>
            Prices and pickup locations are <em>non-negotiable</em>. Pickup
            times are limited to your business hours.
          </li>
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

export default MessagesPopup;
