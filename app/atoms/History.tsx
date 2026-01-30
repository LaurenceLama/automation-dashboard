export type TriggerType = "manual" | "webhook" | "completion";

export type ExecutionStatus = "pending" | "success" | "error";

export interface History {
  name: string;
  email: string;
  timestamp: string;
  workflowName: string;
  status: ExecutionStatus;
  trigger: TriggerType;
  executionId: string;
  errorMessage?: string;
}
