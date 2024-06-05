import { Button } from "@/app/components/ui/button";
import React, { useEffect, useState } from "react";

const PwaInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can add to home screen
      setShowInstallBtn(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = () => {
    // Hide the button
    setShowInstallBtn(false);
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the A2HS prompt");
      } else {
        console.log("User dismissed the A2HS prompt");
      }
      setDeferredPrompt(null);
    });
  };

  const openPwa = () => {
    // Open the PWA using the root URL of your website
    window.location.href = "/";
  };

  return (
    <>
      {showInstallBtn &&
      !window.matchMedia("(display-mode: standalone)").matches ? (
        <Button onClick={handleInstallClick}>Add to Home Screen</Button>
      ) : (
        <Button onClick={openPwa}>Open PWA</Button>
      )}
    </>
  );
};

export default PwaInstall;
