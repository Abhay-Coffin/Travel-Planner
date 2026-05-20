import React, { useEffect, useState } from "react";
import "./PWAInstall.css";

const PWAInstall = () => {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const installApp = async () => {
    if (!installPrompt) return;

    installPrompt.prompt();

    const result = await installPrompt.userChoice;

    if (result.outcome === "accepted") {
      setIsVisible(false);
      setInstallPrompt(null);
    }
  };

  if (!isVisible) return null;

  return (
    <button className="pwa__install-btn" onClick={installApp}>
      <i className="ri-download-cloud-line"></i>
      Install App
    </button>
  );
};

export default PWAInstall;