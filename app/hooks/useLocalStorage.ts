"use client";

import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);

  // LOAD once on mount
  // NOTE: React Compiler may warn about setState in effect.
  // This effect runs once and is safe by design.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) {
        setValue(JSON.parse(stored));
      }
    } catch {
      console.warn(`Failed to read localStorage key: ${key}`);
    }
  }, [key]);

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.warn(`Failed to write localStorage key: ${key}`);
    }
  }, [key, value]);

  return [value, setValue] as const;
}
