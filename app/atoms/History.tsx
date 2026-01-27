export type TriggerType = "manual" | "webhook" | "completion";

export interface History {
  name: string;
  email: string;
  timestamp: string;
  workflowName: string;
  status: "pending" | "success" | "error";
  trigger: TriggerType;
}
