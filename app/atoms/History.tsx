export type TriggerType = "manual" | "scheduled" | "webhook" | "completion";

export type ExecutionStatus = "pending" | "success" | "error";

export interface Execution {
  executionId: string;
  workflowName: string;
  name: string;
  email: string;

  status: ExecutionStatus;
  trigger: TriggerType;

  timestamp: string;

  result?: {message?: string;} | null;

  resolvedAt?: string | null;

  errorMessage?: string | null;
}
