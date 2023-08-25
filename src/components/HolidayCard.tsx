"use client";
import { useState, useCallback } from "react";
import { CitySelector } from "./CitySelector";
import { City, DistanceUnit } from "./City";
import { getCitiesInRange } from "./helper";
import toast, { ToastBar, Toaster } from "react-hot-toast";
import { CityInformation } from "./CityInformation";
import Link from "next/link";
import { UseIsClient } from "./useIsClient";

const INITIAL_DISTANCE = 50;
const INITIAL_DISTANCE_UNIT: DistanceUnit = "miles";

export function HolidayCard() {
  const isClient = UseIsClient();
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [selectedDistance, setSelectedDistance] = useState<number | null>(INITIAL_DISTANCE);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedDistanceUnit, setSelectedDistanceUnit] = useState<DistanceUnit>(INITIAL_DISTANCE_UNIT);
  const [destinationCity, setDestinationCity] = useState<City | null>(null);
  const isSubmitDisabled = !selectedDistance || !selectedCity;

  const handleShare = (includeCity: boolean) => {
    if (includeCity) {
      window.navigator.share({
        title: `Explore the beauty of ${destinationCity?.name}`,
        text: `Learn more about ${destinationCity?.name} and see if it's your next holiday destination.`,
        url: `${window.location.href}info?city=${destinationCity?.name}&country=${destinationCity?.countryCode}`,
      });
    } else {
      window.navigator.share({
        title: "Discover an ideal holiday with this website!",
        text: "Uncover a potential dream destination tailored just for you.",
        url: window.location.href,
      });
    }
  };

  const setDestination = useCallback(
    async (flipCard: boolean) => {
      const citiesInRange = await getCitiesInRange({
        selectedCity,
        selectedDistance,
        selectedDistanceUnit,
      });
      const randomCity = citiesInRange[Math.floor(Math.random() * citiesInRange.length)];
      if (randomCity) {
        setDestinationCity(randomCity);
        if (flipCard) {
          setIsCardFlipped(true);
        }
      } else {
        toast("Oh no! No cities found within the distance you provided!", {
          id: "fixed-id-to-prevent-duplicates",
          duration: 8000,
          style: {
            border: "1px solid #3b82f6",
            padding: "8px",
            color: "#1e3a8a",
            background: "#bfdbfe",
          },
          iconTheme: {
            primary: "#3b82f6",
            secondary: "#bfdbfe",
          },
        });
      }
    },
    [selectedCity, selectedDistance, selectedDistanceUnit]
  );

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h1 className="text-white font-bold text-2xl mb-2">We’ll find you the perfect holiday destination</h1>
          <h2 className="text-white font-bold mb-4">Tell us how far you want to travel - and we’ll do the rest</h2>
        </div>
        <div className="flex justify-center">
          <div className={isCardFlipped ? "w-full" : "w-72"}>
            {!isCardFlipped ? (
              <div className="bg-white p-4 shadow-lg">
                <CitySelector
                  selectedCity={selectedCity}
                  selectedDistance={selectedDistance}
                  selectedDistanceUnit={selectedDistanceUnit}
                  onCityChanged={setSelectedCity}
                  onDistanceChanged={setSelectedDistance}
                  onDistanceUnitChanged={setSelectedDistanceUnit}
                />
                <div className="flex justify-end mt-4">
                  {isClient && window.navigator && window.navigator["share"] && (
                    <button
                      className="px-2 py-1 ml-2 text-blue-800 rounded hover:bg-blue-100"
                      onClick={() => handleShare(false)}
                    >
                      Share
                    </button>
                  )}
                  <button
                    className={`px-2 py-1 text-lg text-blue-800 rounded hover:bg-blue-100 ${
                      isSubmitDisabled ? "cursor-not-allowed text-gray-500" : "hover:bg-blue-200"
                    }`}
                    onClick={() => setDestination(true)}
                    disabled={isSubmitDisabled}
                  >
                    Go on a holiday!
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white p-4 shadow-lg">
                {destinationCity ? <CityInformation city={destinationCity} /> : null}
                <div className="flex justify-end mt-4">
                  <button
                    className="px-2 rounded text-gray-500 hover:bg-blue-200"
                    onClick={() => setIsCardFlipped(false)}
                  >
                    Go back
                  </button>
                  <Link
                    className="px-2 py-1 ml-2 text-blue-800 rounded hover:bg-blue-100"
                    href={`/info?city=${destinationCity?.name}&country=${destinationCity?.countryCode}`}
                  >
                    AI&apos;s Top Picks for You
                  </Link>
                  {isClient && window.navigator && window.navigator["share"] && (
                    <button
                      className="px-2 py-1 ml-2 text-blue-800 rounded hover:bg-blue-100"
                      onClick={() => handleShare(true)}
                    >
                      Share
                    </button>
                  )}
                  <button
                    className="px-2 py-1 text-blue-800 rounded hover:bg-blue-100"
                    onClick={() => setDestination(false)}
                  >
                    Try again!
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Toaster>
        {(t) => (
          <ToastBar toast={t}>
            {({ icon, message }) => (
              <>
                {icon}
                {message}
                {t.type !== "loading" && <button onClick={() => toast.dismiss(t.id)}>x</button>}
              </>
            )}
          </ToastBar>
        )}
      </Toaster>
    </div>
  );
}
