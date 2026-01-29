export type TriggerType = "manual" | "webhook" | "completion";

export type ExecutionStatus = "pending" | "running" | "success" | "error";

export interface History {
  name: string;
  email: string;
  timestamp: string;
  workflowName: string;
  status: "pending" | "success" | "error";
  trigger: TriggerType;
}
