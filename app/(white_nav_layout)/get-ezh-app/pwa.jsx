import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";

const PwaInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
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
        <>
          <h3>Press the Install Button Below</h3>
          <Button onClick={handleInstallClick}>Add to Home Screen</Button>
          <p>or</p>
          <ul>
            <li>Press the download button on the right side of search bar</li>
            <li>Press Install</li>
          </ul>
        </>
      ) : (
        <div>
          You've already installed the EZH app on this device. It should be on
          your device's homescreen or app list
        </div>
      )}
    </>
  );
};

export default PwaInstall;
