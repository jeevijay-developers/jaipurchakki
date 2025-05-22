"use client";
import React, { useState, useEffect } from "react";
import L from "leaflet";
import { FaMapMarkerAlt } from "react-icons/fa";
import { renderToString } from "react-dom/server";

const customIcon = new L.divIcon({
  html: renderToString(<FaMapMarkerAlt size={32} color="red" />),
  className: "custom-marker",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

const LocationSelector = ({ onLocationSelect, initialPosition }) => {
  const [position, setPosition] = useState(initialPosition);

  useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition]);

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        onLocationSelect(lat, lng);
      },
    });
    return null;
  };

  const MapUpdater = () => {
    const map = useMap();
    useEffect(() => {
      map.setView(position, 12);
    }, [position, map]);
    return null;
  };

  return (
    <MapContainer
      center={position}
      zoom={12}
      className="h-[200px] w-full sm:h-[300px]"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapClickHandler />
      <MapUpdater />
      {position && <Marker position={position} icon={customIcon} />}
    </MapContainer>
  );
};

const MapModal = ({ isOpen, onClose, onLocationSelect }) => {
  const [location, setLocation] = useState(null);
  const [initialPosition, setInitialPosition] = useState([
    25.1734205, 75.5515873,
  ]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isOpen && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setInitialPosition([latitude, longitude]);
          setLocation({ lat: latitude, lng: longitude });
        },
        (error) => console.error("Error getting location:", error)
      );
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLocationSelect = (lat, lng) => {
    setLocation({ lat, lng });
    setInitialPosition([lat, lng]);
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`
      );
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        handleLocationSelect(parseFloat(lat), parseFloat(lon));
      } else {
        alert("Location not found");
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

  const handleConfirmLocation = () => {
    if (location) {
      onLocationSelect(location);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg sm:max-w-xl md:max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Select Location</h2>

        <div className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder="Enter location"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow px-2 py-1 border rounded"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
          >
            Search
          </button>
        </div>

        <LocationSelector
          onLocationSelect={handleLocationSelect}
          initialPosition={initialPosition}
        />

        {location && (
          <p className="mt-4 text-sm">
            Selected Coordinates: Latitude: {location.lat.toFixed(4)},
            Longitude: {location.lng.toFixed(4)}
          </p>
        )}

        <div className="mt-4 flex justify-between">
          <button
            onClick={onClose}
            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmLocation}
            disabled={!location}
            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 disabled:opacity-50"
          >
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapModal;
