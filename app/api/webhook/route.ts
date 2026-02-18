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
