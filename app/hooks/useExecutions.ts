"use client";

import { useEffect, useState } from "react";
import { createClient } from "../utils/supabase/client";

export function useExecutions<T>(initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const supabase = createClient()

  // LOAD once on mount
  useEffect(() => {
    const loadExecutions = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return
      
      const { data, error } = await supabase
        .from("executions")
        .select("*")
        .eq("client_id", user.id)
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
  }, [supabase]);

  // NEXT: support webhook-triggered executions

  return [value, setValue] as const;
}
