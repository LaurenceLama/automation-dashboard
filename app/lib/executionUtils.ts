import { Execution } from "../atoms/History";

export function getLatestExecution(history: Execution[]): Execution | undefined {
  return [...history].sort(
    (a, b) =>
      new Date(b.timestamp).getTime() -
      new Date(a.timestamp).getTime()
  )[0];
}

export function isLoading(history: Execution[]): boolean {
  return history.some(h => h.status === "pending");
}

export function addExecution(
  history: Execution[],
  execution: Execution
): Execution[] {
  return [...history, execution];
}

export function updateExecutionStatus(
  history: Execution[],
  id: string,
  status: Execution["status"]
): Execution[] {
  return history.map(e =>
    e.executionId === id ? { ...e, status } : e
  );
}

