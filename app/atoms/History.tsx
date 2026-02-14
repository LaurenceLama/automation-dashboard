export type TriggerType = "manual" | "webhook" | "completion";

export type ExecutionStatus = "pending" | "success" | "error";

export type ErrorType = "timeout" | "runtime" | "webhook";

export interface History {
  // Necessities (must always be displayed)
  name: string;
  email: string;

  trigger: TriggerType;
  
  timestamp: string;
  
  workflowName: string;
  executionId: string; // since this is mostly helpful only for devs, must be on reduced opacity
  
  status: ExecutionStatus;
  errorType?: ErrorType;
  
  errorMessage?: string; // would be great if the message includes what exactly is wrong and how the error occurred, not just the usual 'an error occurred'

  // Optional to display (depends on the future clients needs/requirements)
  // workflowId?: string;
  // startedAt?: string;
  // finishedAt?: string;
}
