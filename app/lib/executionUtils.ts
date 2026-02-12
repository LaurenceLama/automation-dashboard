import { History } from "../atoms/History";

export function getLatestExecution(history: History[]): History | undefined {
  return [...history].sort(
    (a, b) =>
      new Date(b.timestamp).getTime() -
      new Date(a.timestamp).getTime()
  )[0];
}

export function isLoading(history: History[]): boolean {
  return history.some(h => h.status === "pending");
}

export function addExecution(
  history: History[],
  execution: History
): History[] {
  return [...history, execution];
}

export function updateExecutionStatus(
  history: History[],
  id: string,
  status: History["status"]
): History[] {
  return history.map(e =>
    e.executionId === id ? { ...e, status } : e
  );
}


// export function getLatestExecution(history) {
//   return [...history].sort((a, b) => b.timestamp - a.timestamp)[0];
// }

// export function isLoading(history) {
//   return history.some(h => h.status === "pending");
// }

// export function addExecution(history, execution) {
//   return [...history, execution];
// }

// export function updateExecutionStatus(history, id, status) {
//   return history.map(e =>
//     e.id === id ? { ...e, status } : e
//   );
// }