"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useExecutions<T>(clientId: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);

  // LOAD once on mount
  useEffect(() => {
    const loadExecutions = async () => {
      const { data, error } = await supabase
        .from("executions")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase load error:", error);
        return;
      }

      const mapped = data.map((row) => ({
        executionId: row.execution_id,
        workflowName: row.workflow_name ?? "Unknown workflow",
        name: row.name ?? "Unknown",
        email: row.email ?? "Unknown",
        status: row.status,
        trigger: row.trigger ?? "manual",
        timestamp: row.created_at,
        result: row.result ?? null,
        resolvedAt: row.resolved_at ?? null,
      }));

      setValue(mapped as unknown as T);
    };

    loadExecutions();

    const interval = setInterval(loadExecutions, 2000);

    return () => clearInterval(interval);
  }, [clientId]);

  // NEXT: support webhook-triggered executions

  return [value, setValue] as const;
}
