import { createClient } from "../utils/supabase/client";
import { Execution } from "../atoms/History";

const TIMEOUT_MINUTES = 5;

export async function resolveExecutionTimeouts(executions: Execution[]) {
  const supabase = createClient();
  const now = Date.now();

  const timedOut = executions.filter((execution) => {
    if (execution.status !== "pending") return false;

    const createdAt = new Date(execution.timestamp).getTime();
    const minutesElapsed = (now - createdAt) / 1000 / 60;

    return minutesElapsed > TIMEOUT_MINUTES;
  });

  if (!timedOut.length) return;

  await Promise.all(
    timedOut.map((execution) =>
      supabase
        .from("executions")
        .update({
          status: "error",
          error_type: "timeout",
          error_message:
            "Execution timed out. No response received from automation platform.",
          resolved_at: new Date().toISOString(),
        })
        .eq("execution_id", execution.executionId)
    )
  );
}
