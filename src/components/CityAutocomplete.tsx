"use client";
import { AsyncProps } from "react-select/async";
import { City } from "./City";
import dynamic from "next/dynamic";
import { GroupBase } from "react-select";
import { useCallback } from "react";
import { filterCities } from "./helper";

const AsyncSelectNoSSR = dynamic<
  AsyncProps<{ value: City; label: string }, false, GroupBase<{ value: City; label: string }>>
>(() => import("react-select/async").then((mod) => mod.default), {
  ssr: false,
});

type CityAutocompleteProps = {
  onCityChange: (selectedCity: City | null) => void;
  currentCity: City | null;
};

export function CityAutocomplete({ onCityChange, currentCity }: CityAutocompleteProps) {
  const loadOptions = useCallback(
    (inputValue: string, callback: (options: { label: string; value: City }[]) => void) => {
      async function init() {
        callback(await filterCities(inputValue));
      }
      init();
    },
    []
  );
  return (
    <div className="mb-2">
      <label className="block text-sm font-medium text-gray-700">Choose a city near you</label>
      <AsyncSelectNoSSR
        cacheOptions
        defaultOptions
        aria-label="Choose a city near you"
        loadOptions={loadOptions}
        onChange={(selectedOption) => {
          const selected = selectedOption ? selectedOption.value : null;
          onCityChange(selected);
        }}
        value={currentCity ? { label: `${currentCity.name} - ${currentCity.countryCode}`, value: currentCity } : null}
        className="mt-1"
        classNames={{
          control: () => "!border-blue-800 border",
        }}
      />
    </div>
  );
}
