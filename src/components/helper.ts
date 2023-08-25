"use server";

import { City, DistanceUnit } from "./City";
import * as geolib from "geolib";
import cities from "@/app/cities.json";

const MILES_UNIT = "mi";
const KILOMETERS_UNIT = "km";

export const getCitiesInRange = async ({
  selectedCity,
  selectedDistanceUnit,
  selectedDistance,
}: {
  selectedCity: City | null;
  selectedDistanceUnit: DistanceUnit;
  selectedDistance: number | null;
}) => {
  if (!selectedCity || !selectedDistance) {
    return [];
  }

  const selectedCityCoordinates = {
    longitude: selectedCity.longitude,
    latitude: selectedCity.latitude,
  };

  return cities.filter((city) => {
    const cityCoordinates = {
      longitude: city.longitude,
      latitude: city.latitude,
    };
    const calculatedDistance = geolib.getDistance(selectedCityCoordinates, cityCoordinates);
    const convertedDistance = geolib.convertDistance(
      calculatedDistance,
      selectedDistanceUnit === "miles" ? MILES_UNIT : KILOMETERS_UNIT
    );

    return convertedDistance > 0 && convertedDistance < selectedDistance;
  });
};

export const getClosestCityToCoords = async ({ longitude, latitude }: { longitude: number; latitude: number }) => {
  let closestCity = { city: cities[0], distance: Infinity };
  for (const city of cities) {
    const cityCoordinates = {
      longitude: city.longitude,
      latitude: city.latitude,
    };
    const calculatedDistance = geolib.getDistance({ longitude, latitude }, cityCoordinates);
    if (calculatedDistance < closestCity.distance) {
      closestCity = { city, distance: calculatedDistance };
    }
  }
  return closestCity.city;
};

export const filterCities = async (input: string) => {
  return cities
    .filter((city) => city.name.toLowerCase().includes(input.toLowerCase()))
    .map((city) => ({
      value: city,
      label: `${city.name} - ${city.countryCode}`,
    }))
    .slice(0, 25);
};
