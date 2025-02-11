"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { XMarkIcon } from "@heroicons/react/20/solid";
import Draggable from "react-draggable";
import { useRouter } from "next/navigation";
import { OutfitFont } from "@/components/fonts";

const CreatePopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(1);
  const nodeRef = useRef(null);

  useEffect(() => {
    const hasVisitedCreatePage = localStorage.getItem("hasVisitedCreatePage");
    if (!hasVisitedCreatePage) {
      setShowPopup(true);
      localStorage.setItem("hasVisitedCreatePage", "true");
    }
  }, []);
  const router = useRouter();
  const handleContinue = () => {
    setShowPopup(false);
    localStorage.removeItem("hasVisitedMapPage");
    router.push("/map");
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
          ${OutfitFont.className}
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
        <h2 className="text-2xl font-bold mb-4">Welcome to Listing on EZH</h2>
        <p className="mb-4">Here's some key info to listing your goods:</p>
        <ul className="list-disc list-inside mb-4">
          <li>
            If you don't see the name of your listing, you can propose a new
            title
          </li>
          <li>
            Listings are tied to one of up to three of your locations & the
            corresponding hours.
          </li>
          <li>
            Each section has help articles if you're ever confused about the how
            or why.
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

export default CreatePopup;
