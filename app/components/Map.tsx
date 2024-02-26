"use client";
import React from "react";
import L from "leaflet"; // Importing leaflet library
import { MapContainer, Marker, TileLayer } from "react-leaflet"; // Importing necessary components from react-leaflet
import "leaflet/dist/leaflet.css"; // Importing leaflet CSS
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png"; // Importing marker icon for retina display
import markerIcon from "leaflet/dist/images/marker-icon.png"; // Importing marker icon
import markerShadow from "leaflet/dist/images/marker-shadow.png"; // Importing marker shadow image

// Delete the default icon URLs to fix the marker display issue in leaflet
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src, // Setting icon URL
  iconRetinaUrl: markerIcon2x.src, // Setting retina icon URL
  shadowUrl: markerShadow.src, // Setting shadow URL
});

// Define props interface for the Map component
interface MapProps {
  center?: number[]; // Center coordinate for the map, optional
}

// Base URL and attribution for the tile layer
const url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

// Map component
const Map: React.FC<MapProps> = ({ center }) => {
  return (
    <MapContainer
      center={(center as L.LatLngExpression) || [51, -0.09]} // Center coordinate, default to London if not provided
      zoom={center ? 4 : 2} // Zoom level, default to 2 if no center provided
      scrollWheelZoom={false} // Disable scroll wheel zoom
      className="h-[35vh] rounded-lg" // Custom styling for the map container
    >
      {/* Tile layer using OpenStreetMap */}
      <TileLayer
        url={url} // Tile layer URL
        attribution={attribution} // Attribution for the tile layer
      />
      {/* Marker component, rendered only if center coordinate is provided */}
      {center && (
        <Marker position={center as L.LatLngExpression} /> // Position of the marker
      )}
    </MapContainer>
  );
};

export default Map;
