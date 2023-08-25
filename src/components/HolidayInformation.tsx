"use client";
import Link from "next/link";
import { City } from "./City";
import React, { useEffect, useState } from "react";

export function HolidayInformation({ city }: { city: City | undefined }) {
  const [data, setData] = useState("");

  useEffect(() => {
    let isCancelled = false;
    async function fetchData() {
      if (!city) {
        setData(
          "Unfortunately we are not able to provide you with information about this city. Please try again later."
        );
        return;
      }
      const data = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ city: city.name, country: city.countryCode }),
      });
      if (!data.ok || !data.body || isCancelled) {
        if (!isCancelled) {
          setData(
            "Unfortunately we are not able to provide you with information about this city. Please try again later."
          );
        }
        return;
      }
      const reader = data.body.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { done, value } = await reader.read();
        if (done || isCancelled) {
          break;
        }
        if (!isCancelled) {
          setData((oldData) => oldData + decoder.decode(value, { stream: true }));
        }
      }

      if (!isCancelled) {
        setData((oldData) => oldData + decoder.decode());
      }
    }

    fetchData();

    return () => {
      setData("");
      isCancelled = true;
    };
  }, [city]);

  const handleShare = () => {
    if (!city) {
      return;
    }
    window.navigator.share({
      title: `Explore the beauty of ${city.name}`,
      text: `Learn more about ${city.name} and see if it's your next holiday destination.`,
      url: window.location.href,
    });
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h1 className="text-white font-bold text-2xl mb-2">We’ll find you the perfect holiday destination</h1>
          <h2 className="text-white font-bold mb-4">Tell us how far you want to travel - and we’ll do the rest</h2>
        </div>
        <div className="flex justify-center">
          <div className={"w-[70vw]"}>
            <div className="bg-white p-4 shadow-lg">
              <div className="data-container max-h-[60vh] overflow-y-auto overflow-x-hidden">
                <pre className="whitespace-pre-wrap break-words">{data}</pre>
              </div>
              <div className="flex justify-end mt-4">
                {window.navigator && window.navigator["share"] && (
                  <button className="px-2 text-blue-800 rounded hover:bg-blue-100" onClick={handleShare}>
                    Share
                  </button>
                )}
                <Link className="px-2 rounded text-gray-500 hover:bg-blue-200" href={`/`}>
                  Go back
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
