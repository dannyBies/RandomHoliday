"use client";
import { ChangeEvent, useCallback, useState } from "react";
import { DistanceUnit } from "./City";

const MIN_DISTANCE = 1;
const MAX_DISTANCE = 100000;

type DistanceInputProps = {
  selectedDistance: number | null;
  onDistanceChange: (newValue: number | null) => void;
  selectedDistanceUnit: DistanceUnit;
};

export function isValidDistance(distance: string) {
  const numericDistance = parseFloat(distance);

  if (isNaN(numericDistance)) {
    return { isValid: false, message: "Please enter a valid number", value: null } as const;
  }
  if (numericDistance < MIN_DISTANCE || numericDistance > MAX_DISTANCE) {
    return {
      isValid: false,
      message: `Please enter a number between ${MIN_DISTANCE} and ${MAX_DISTANCE}`,
      value: numericDistance,
    } as const;
  }

  return { isValid: true, value: numericDistance, message: null } as const;
}

export function DistanceInput({ selectedDistance, onDistanceChange, selectedDistanceUnit }: DistanceInputProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const validateDistance = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const result = isValidDistance(e.target.value);
      setErrorMessage(result.message);
      onDistanceChange(result.value);
    },
    [onDistanceChange]
  );

  return (
    <div className="mb-2">
      <label className="block text-sm font-medium text-gray-700" htmlFor="distance-input">
        Max travel distance ({selectedDistanceUnit})
      </label>
      <input
        id="distance-input"
        type="number"
        value={selectedDistance === null ? "" : selectedDistance}
        onChange={validateDistance}
        className={`mt-1 block w-full border-blue-800 rounded-md shadow-sm py-2 px-3 border focus:outline-none focus:ring-indigo-500 sm:text-sm ${
          errorMessage ? "border border-red-500 " : "border-gray-300 focus:border-indigo-500"
        }`}
        required
        min={MIN_DISTANCE}
        max={MAX_DISTANCE}
        aria-label={`Max travel distance in ${selectedDistanceUnit}`}
      />
      {errorMessage && <p className="mt-2 text-xs text-red-600">{errorMessage}</p>}
    </div>
  );
}
