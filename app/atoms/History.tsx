export type TriggerType = "manual" | "scheduled" | "webhook" | "completion";

export type ExecutionStatus = "pending" | "success" | "error";

export type ErrorType =
  | "timeout"
  | "runtime"
  | "webhook"
  | "validation"
  | "unknown";

export interface Execution {
  executionId: string;
  workflowName: string;
  name: string;
  email: string;

  status: ExecutionStatus;
  trigger: TriggerType;

  timestamp: string;

  resolvedAt?: string | null;
  
  result?: { message?: string } | null;
  errorMessage?: string | null;
  errorType?: ErrorType | null;

}

// export interface History {
//   executionId: string;
//   workflowName: string;
//   name: string;
//   email: string;

//   status: ExecutionStatus;
//   trigger: TriggerType;

//   timestamp: string;

//   result?: {message?: string;} | null;

//   resolvedAt?: string | null;

//   errorMessage?: string | null;
// }
