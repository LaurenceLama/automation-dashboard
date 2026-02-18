"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useExecutions<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);

  // LOAD once on mount
  useEffect(() => {
    const loadExecutions = async () => {
      const { data, error } = await supabase
        .from("executions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase load error:", error);
        return;
      }

      const mapped = data.map((row) => ({
        executionId: row.execution_id,
        status: row.status,
        trigger: row.trigger ?? "manual",
        timestamp: row.created_at,
      }));

      setValue(mapped as unknown as T);
    };

    loadExecutions();

    const interval = setInterval(loadExecutions, 2000);

    return () => clearInterval(interval);
  }, []);

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
