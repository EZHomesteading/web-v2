// get-device-info.tsx
"use client";
import { useEffect, useState } from "react";

export default function useDeviceInfo() {
  const [device, setDevice] = useState("");
  const [browser, setBrowser] = useState("");

  useEffect(() => {
    const userAgent = navigator.userAgent;
    if (/Android/i.test(userAgent)) {
      setDevice("Android");
    } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
      setDevice("iOS");
    } else if (/Win/i.test(userAgent)) {
      setDevice("Windows");
    } else if (/Mac/i.test(userAgent)) {
      setDevice("Mac");
    } else if (/Linux/i.test(userAgent)) {
      setDevice("Linux");
    }

    if (/Chrome/i.test(userAgent)) {
      setBrowser("Chrome");
    } else if (/Safari/i.test(userAgent)) {
      setBrowser("Safari");
    } else if (/Firefox/i.test(userAgent)) {
      setBrowser("Firefox");
    } else if (/Edge/i.test(userAgent)) {
      setBrowser("Edge");
    }
  }, []);

  return { device, browser };
}
