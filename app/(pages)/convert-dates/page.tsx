"use client";
import React from "react";
import axios from "axios";

const ConvertDatesButton = () => {
  const handleConvertDates = async () => {
    try {
      await axios.post("/api/date-users");
      console.log("Dates converted and updated successfully.");
    } catch (error) {
      console.error("Error converting and updating dates:", error);
    }
  };

  return <button onClick={handleConvertDates}>Convert and Update Dates</button>;
};

export default ConvertDatesButton;
