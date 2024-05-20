"use client";

import { useEffect } from "react";

const SessionStorageManager = () => {
  useEffect(() => {
    sessionStorage.setItem("ORDER", "");
  }, []);

  return null;
};

export default SessionStorageManager;
