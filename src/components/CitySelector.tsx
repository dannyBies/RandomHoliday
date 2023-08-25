"use client";
import React, { useCallback } from "react";
import { CityAutocomplete } from "./CityAutocomplete";
import { DistanceInput } from "./DistanceInput";
import { City, DistanceUnit } from "./City";
import { getClosestCityToCoords } from "./helper";
import toast from "react-hot-toast";
import { UseIsClient } from "./useIsClient";

type CitySelectorProps = {
  onDistanceChanged: (selectedDistance: number | null) => void;
  onCityChanged: (selectedCity: City | null) => void;
  onDistanceUnitChanged: (selectedDistanceUnit: DistanceUnit) => void;
  selectedDistance: number | null;
  selectedCity: City | null;
  selectedDistanceUnit: DistanceUnit;
};

export function CitySelector({
  selectedCity,
  selectedDistance,
  selectedDistanceUnit,
  onCityChanged,
  onDistanceChanged,
  onDistanceUnitChanged,
}: CitySelectorProps) {
  const isClient = UseIsClient();
  const handleSwitchDistanceUnit = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      const value = selectedDistanceUnit === "miles" ? "kilometers" : "miles";
      onDistanceUnitChanged(value);
    },
    [selectedDistanceUnit, onDistanceUnitChanged]
  );

  const handleUseMyLocation = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      window.navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
          const latitude = coords.latitude;
          const longitude = coords.longitude;
          const nearestCity = await getClosestCityToCoords({ latitude, longitude });

          onCityChanged(nearestCity);
        },
        (error) => {
          switch (error.code) {
            case 1: {
              toast.error(
                "We are unable to use your location as you have denied this permission in your browser. Please allow access to your location to continue.",
                { duration: Infinity }
              );
              break;
            }
            case 2: {
              toast.error(
                "We are unable to determine your location at this time. Please ensure your device's location services are enabled.",
                { duration: Infinity }
              );
              break;
            }
            case 3: {
              toast.error("The request to access your location has timed out. Please try again.", {
                duration: Infinity,
              });
              break;
            }
          }
        }
      );
    },
    [onCityChanged]
  );

  return (
    <>
      <h3 className="mt-0 text-xl">Discover your holiday!</h3>
      <CityAutocomplete currentCity={selectedCity} onCityChange={onCityChanged} />
      {isClient && window.navigator && window.navigator.geolocation && (
        <>
          <div className="my-2 flex items-center justify-center">
            <hr className="w-full border-gray-300" />
            <span className="px-2 text-sm text-gray-500 bg-white">Or</span>
            <hr className="w-full border-gray-300" />
          </div>
          <button
            className="mb-2 text-blue-800 hover:text-blue-600 w-full py-2 px-4 rounded border border-blue-800 text-center hover:bg-blue-100"
            onClick={handleUseMyLocation}
          >
            Use my location
          </button>
        </>
      )}
      <DistanceInput
        selectedDistance={selectedDistance}
        onDistanceChange={onDistanceChanged}
        selectedDistanceUnit={selectedDistanceUnit}
      />
      <div className="mt-2">
        <button
          className="text-sm px-2 py-1 rounded text-blue-800  hover:bg-blue-100"
          onClick={handleSwitchDistanceUnit}
        >
          Switch to {selectedDistanceUnit === "miles" ? "kilometers" : "miles"}
        </button>
      </div>
    </>
  );
}
