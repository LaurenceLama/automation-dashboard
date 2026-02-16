import { History } from "../atoms/History";

const TIMEOUT_MINUTES = 1;

export function applyExecutionTimeouts(executions: History[]): History[] {
  const now = Date.now();

  return executions.map((execution) => {
    if (execution.status !== "pending") return execution;

    const createdAt = new Date(execution.timestamp).getTime();
    const minutesElapsed = (now - createdAt) / 1000 / 60;

    // In case pending takes too long, set to timeout - If a callback is not received within a defined window, the execution is treated as failed.
    if (minutesElapsed > TIMEOUT_MINUTES) {
      return {
        ...execution,
        status: "error" as const,
        errorType: "timeout" as const,
        errorMessage: "Execution timed out. No response received from automation platform.",
      };
    }

    return execution;
  });
}
