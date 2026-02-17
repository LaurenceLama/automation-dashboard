"use client";

import { useEffect, useState } from "react";
import { applyExecutionTimeouts } from "../lib/timeout";
import { History } from "../atoms/History";
import { supabase } from "../lib/supabase";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);

  // LOAD once on mount
  // NOTE: React Compiler may warn about setState in effect.
  // This effect runs once and is safe by design.
  // useEffect(() => {
  //   try {
  //     const stored = localStorage.getItem(key);

  //     if (stored !== null) {
  //       const parsed: T = JSON.parse(stored);

  //       // If this is History[], apply timeout recovery
  //       if (Array.isArray(parsed)) {
  //         const recovered = applyExecutionTimeouts(
  //           parsed as History[],
  //         ) as unknown as T;

  //         setValue(recovered);

  //         // Sync corrected version to storage
  //         if (JSON.stringify(parsed) !== JSON.stringify(recovered)) {
  //           localStorage.setItem(key, JSON.stringify(recovered));
  //         }
  //       } else {
  //         setValue(parsed);
  //       }
  //     }
  //   } catch {
  //     console.warn(`Failed to read localStorage key: ${key}`);
  //   }
  // }, [key]);
  useEffect(() => {
    const loadExecutions = async () => {
      const { data } = await supabase
        .from("executions")
        .select("*")
        .order("created_at", { ascending: false });

      setHistory(data || []); // working on it
    };

    loadExecutions();

    const interval = setInterval(loadExecutions, 2000);

    return () => clearInterval(interval);
  }, []);

  // SAVE whenever value changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.warn(`Failed to write localStorage key: ${key}`);
    }
  }, [key, value]);

  // This will call a Make webhook to start the workflow
  // The execution history will update ONLY after Make responds
  // NOTE: Workflow execution updates should occur
  // after an external system responds (e.g. webhook callback)

  // function triggerWorkflowRun() {
  //   // TODO: Call Make webhook here
  // }

  // NEXT: support webhook-triggered executions

  return [value, setValue] as const;
}
