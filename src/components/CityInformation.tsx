"use client";
import { MapContainerProps, TileLayerProps, useMap, useMapEvent } from "react-leaflet";
import { City } from "./City";
import dynamic from "next/dynamic";
import React, { memo, useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

export const MapContainer = memo(
  dynamic<MapContainerProps>(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
);
export const TileLayer = dynamic<TileLayerProps>(() => import("react-leaflet").then((mod) => mod.TileLayer), {
  ssr: false,
});

const TILE_LAYER_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
export function CityInformation({ city }: { city: City }) {
  return (
    <div className="h-full w-full overflow-auto">
      <h2 className="mt-0">You are going to {city.name}!</h2>
      <div className="h-[50vh] relative">
        <MapContainer className="absolute top-0 left-0 w-full h-full ">
          <TileLayer url={TILE_LAYER_URL} />
          <SetView city={city} />
          <SetViewOnClick />
        </MapContainer>
      </div>
    </div>
  );
}

function SetViewOnClick() {
  const map = useMapEvent("click", (e) => {
    map.setView(e.latlng, map.getZoom(), {
      animate: true,
    });
  });

  return null;
}

function SetView({ city }: { city: City }) {
  const map = useMap();
  const prevCityRef = useRef<City | null>(null);

  useEffect(() => {
    if (
      prevCityRef.current &&
      (prevCityRef.current.latitude !== city.latitude || prevCityRef.current.longitude !== city.longitude)
    ) {
      // If the city has changed, use flyTo
      map.flyTo(
        {
          lat: +city.latitude,
          lng: +city.longitude,
        },
        12
      );
    } else {
      // If this is the initial render, use setView
      map.setView(
        {
          lat: +city.latitude,
          lng: +city.longitude,
        },
        12
      );
    }

    // Update the previous city ref to the current city
    prevCityRef.current = city;
  }, [city, map]);

  return null;
}
