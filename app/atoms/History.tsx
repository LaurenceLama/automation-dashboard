export interface History {
  workflowName: string;
  name: string;
  email: string;
  timestamp: string;
  status: "success" | "error";
}
