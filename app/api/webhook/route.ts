import { NextResponse } from "next/server";

// TEMP: in-memory store (replace later with DB)
const executions: Record<
  string,
  {
    status: "pending" | "success" | "error";
    errorMessage?: string;
    timestamp: string;
  }
> = {};

export async function POST(req: Request) {
  const body = await req.json();

  const { executionId, status, timestamp, errorMessage } = body;

  if (
    !executionId ||
    !timestamp ||
    !["success", "error"].includes(status)
  ) {
    return NextResponse.json(
      { error: "Invalid webhook payload" },
      { status: 400 }
    );
  }

  const execution = executions[executionId];

  // If execution does not exist, ignore
  if (!execution) {
    return NextResponse.json({ ignored: true });
  }

  // State machine enforcement 
  if (execution.status !== "pending") {
    return NextResponse.json({ ignored: true });
  }

  executions[executionId] = {
    ...execution,
    status,
    errorMessage,
    timestamp,
  };

  return NextResponse.json({ updated: true });
}
