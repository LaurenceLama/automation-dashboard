import { History } from "../atoms/History";
import { addExecution } from "./executionUtils";

export class ExecutionManager {

  static createExecution(
    history: History[],
    execution: History
  ): History[] {
    return addExecution(history, execution);
  }

  static resolveExecution(
    history: History[],
    executionId: string,
    updates: Partial<History>
  ): History[] {
    return history.map(item =>
      item.executionId === executionId
        ? { ...item, ...updates }
        : item
    );
  }
  
  static timeoutExecution(
    history: History[],
    executionId: string
  ): History[] {
    return history.map(item =>
      item.executionId === executionId &&
      item.status === "pending"
        ? {
            ...item,
            status: "error",
            errorType: "timeout",
            errorMessage:
              "Execution timed out. No response received.",
          }
        : item
    );
  }

}
