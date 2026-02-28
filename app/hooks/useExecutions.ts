"use client";

import { useEffect, useState } from "react";
import { createClient } from "../utils/supabase/client";
import { Execution } from "../atoms/History";
import { resolveExecutionTimeouts } from "../lib/timeoutResolver";

export function useExecutions(initialValue: Execution[]) {
  const [value, setValue] = useState<Execution[]>(initialValue);
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

      await resolveExecutionTimeouts(data);

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
        errorType: row.error_type ?? null,
      }));

      // setValue(mapped as unknown as Execution[]);
      setValue(mapped);
    };

    loadExecutions();

    const interval = setInterval(loadExecutions, 2000);

    return () => clearInterval(interval);
  }, [supabase]);

  async function triggerExecution({
    workflowName,
    name,
    email,
  }: {
    workflowName: string;
    name: string;
    email: string;
  }) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const executionId = crypto.randomUUID();

    // Insert pending execution
    const { error } = await supabase.from("executions").insert({
      execution_id: executionId,
      client_id: user.id,
      workflow_name: workflowName,
      name,
      email,
      status: "pending",
      trigger: "manual",
    });

    if (error) {
      console.error("Insert failed:", error);
      return;
    }

    // Optimistic UI update (instant feedback)
    setValue((prev: Execution[]) => [
      {
        executionId,
        workflowName,
        name,
        email,
        status: "pending",
        trigger: "manual",
        timestamp: new Date().toISOString(),
        result: null,
        resolvedAt: null,
        errorMessage: null,
      },
      ...prev,
    ]);

    // Call Make webhook
    await fetch(
      `https://hook.us2.make.com/${process.env.NEXT_PUBLIC_EXECUTION_WEBHOOK_URL_AFTER_DOT_COM}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          executionId,
          workflowName,
          name,
          email,
          clientId: user.id,
        }),
      },
    );
  }

  return {
    executions: value,
    setExecutions: setValue,
    triggerExecution,
  } as const;
  // return [value, setValue] as const;
}
