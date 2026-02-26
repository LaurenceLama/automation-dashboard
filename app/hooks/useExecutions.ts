"use client";

import { useEffect, useState } from "react";
import { createClient } from "../utils/supabase/client";

export function useExecutions<T>(initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const supabase = createClient();

  // LOAD once on mount
  useEffect(() => {
    const loadExecutions = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;

      const { data: adminCheck } = await supabase
        .from("admins")
        .select("user_id")
        .eq("user_id", userId)
        .maybeSingle();

      const isAdmin = !!adminCheck;

      let query = supabase
        .from("executions")
        .select("*")
        .order("created_at", { ascending: false });

      if (!isAdmin) {
        query = query.eq("client_id", userId);
      }

      const { data, error } = await query;

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
        trigger: row.trigger ?? "webhook",
        timestamp: row.created_at,
        result: row.result ?? null,
        resolvedAt: row.resolved_at ?? null,
        errorMessage: row.error_message ?? null,
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
