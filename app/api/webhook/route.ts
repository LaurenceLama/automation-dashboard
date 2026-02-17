import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function POST(req: Request) {
  const { executionId, status, result } = await req.json();

  await supabase
    .from("executions")
    .update({
      status,
      result,
      resolved_at: new Date().toISOString(),
    })
    .eq("execution_id", executionId);

  return NextResponse.json({ success: true });
}


// ///// to be deleted? 

// import { NextResponse } from "next/server"; 

// // TEMP: in-memory store (replace later with DB)
// const executions: Record<
//   string,
//   {
//     status: "pending" | "success" | "error";
//     errorMessage?: string;
//     timestamp: string;
//   }
// > = {};

// export async function POST(req: Request) {
//   const body = await req.json();

//   const { executionId, status, timestamp, errorMessage } = body;

//   if (
//     !executionId ||
//     !timestamp ||
//     !["success", "error"].includes(status)
//   ) {
//     return NextResponse.json(
//       { error: "Invalid webhook payload" },
//       { status: 400 }
//     );
//   }

//   const existingExecution = executions[executionId];

//   // If execution does not exist, ignore
//   if (!existingExecution) {
//     return NextResponse.json({ ignored: true });
//   }

//   // State machine enforcement 
//   if (existingExecution.status !== "pending") {
//     return NextResponse.json({ ignored: true });
//   }

//   executions[executionId] = {
//     ...existingExecution,
//     status,
//     errorMessage,
//     timestamp,
//   };

//   return NextResponse.json({ updated: true });
// }
