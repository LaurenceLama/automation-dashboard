import { createClient } from "../utils/supabase/client";
import { Execution } from "../atoms/History";

const TIMEOUT_MINUTES = 5;

export async function resolveExecutionTimeouts(
  executions: Execution[]
) {
  const supabase = createClient();
  const now = Date.now();

  for (const execution of executions) {
    if (execution.status !== "pending") continue;

    const createdAt = new Date(execution.timestamp).getTime();
    const minutesElapsed = (now - createdAt) / 1000 / 60;

    if (minutesElapsed <= TIMEOUT_MINUTES) continue;

    console.log("Timeout detected:", execution.executionId);

    // Persist timeout
    await supabase
      .from("executions")
      .update({
        status: "error",
        error_type: "timeout",
        error_message:
          "Execution timed out. No response received from automation platform.",
        resolved_at: new Date().toISOString(),
      })
      .eq("execution_id", execution.executionId);
  }
}