"use client";

import { useEffect } from "react";

const SessionStorageManager = () => {
  useEffect(() => {
    sessionStorage.setItem("ORDER", "");
    sessionStorage.setItem("sidebarCollapsed", JSON.stringify(false));
  }, []);

  return null;
};

export default SessionStorageManager;
