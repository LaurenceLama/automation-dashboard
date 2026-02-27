"use client";

import { useEffect, useState } from "react";
import HistoryPanel from "../components/HistoryPanel";
import { Execution } from "../atoms/History";
import { useExecutions } from "../hooks/useExecutions";
import { applyExecutionTimeouts } from "../lib/timeout";
import { createClient } from "../utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

type Workflow = {
  id: string;
  name: string;
};

export default function DashboardClient({ user }: { user: User }) {
  const supabase = createClient();

  const [name, setName] = useState("");
  const [email, setEmail] = useState(user.email || "");

  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>("");

  const {
    executions: history,
    setExecutions: setHistory,
    triggerExecution,
  } = useExecutions([]);

  const loading = history.some((h) => h.status === "pending");

  const latestExecution =
    history.length > 0
      ? [...history].sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        )[0]
      : null;

  useEffect(() => {
    const interval = setInterval(() => {
      setHistory((prev: Execution[]) => {
        const recovered = applyExecutionTimeouts(prev);
        if (JSON.stringify(prev) !== JSON.stringify(recovered)) {
          return recovered;
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [setHistory]);

  // Fetch workflows on mount
  useEffect(() => {
    const fetchWorkflows = async () => {
      const { data, error } = await supabase
        .from("workflows")
        .select("id, name")
        .order("created_at", { ascending: true });

      if (!error) {
        setWorkflows(data || []);
      }
    };

    fetchWorkflows();
  }, [supabase]);

  async function runAutomation() {
    const executionId = crypto.randomUUID();

    const newExecution: Execution = {
      executionId,
      workflowName: selectedWorkflow,
      name,
      email,
      status: "pending",
      timestamp: new Date().toISOString(),
      trigger: "webhook",
    };

    const { error } = await supabase.from("executions").insert({
      execution_id: executionId,
      client_id: user.id,
      workflow_name: workflows,
      name,
      email,
      status: "pending",
      trigger: "webhook",
    });

    if (error) {
      console.error(error);
      return;
    }

    setHistory((prev) => [newExecution, ...prev]);

    await fetch("https://hook.us2.make.com/vghpnamt50dz2h9u70ed9byhmo7yii42", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        executionId,
        email,
        // workflowName,
        clientId: user.id,
      }),
    });

    await triggerExecution({
      workflowName: selectedWorkflow,
      name,
      email,
    });
  }

  async function handleLogout() {
    await supabase.auth.signOut(redirect("/login"));
  }

  return (
    <main className="min-h-screen flex justify-center">
      <div className="max-w-5xl p-10 xl:flex xl:py-12">
        <div className="xl:w-1/2">
          <h1 className="text-2xl pb-4">Client Dashboard: {user.email}</h1>

          <div className="border rounded-xl min-w-fit p-6 mb-10">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                runAutomation();
              }}
            >
              <div className="">
                <h2>Name</h2>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border border-amber-100 rounded-md py-1 w-3/4 text-emerald-50 mt-1 pl-1 (xl:pr-[40%] sm:pr-[30%])"
                  placeholder="your name"
                />
              </div>

              <div className=" mt-4">
                <h2>Email</h2>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-amber-100 rounded-md py-1 w-3/4 text-emerald-50 mt-1 pl-1 (xl:pr-[40%] sm:pr-[30%])"
                  placeholder="you@example.com"
                />
              </div>

              {/* <div className=" mt-4">
                <h2>Workflow name</h2>
                <input
                  required
                  type="text"
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                  className="border border-amber-100 rounded-md py-1 w-3/4 text-emerald-50 mt-1 pl-1 (xl:pr-[40%] sm:pr-[30%])"
                  placeholder="e.g. Lead intake → CRM"
                />
              </div> */}

              <div className="mt-4 space-y-2">
                <h2>Select Workflow</h2>

                <select
                  value={selectedWorkflow}
                  onChange={(e) => setSelectedWorkflow(e.target.value)}
                  className="p-1 border rounded-md"
                >
                  <option value="">Select a workflow</option>
                  {workflows.map((wf) => (
                    <option key={wf.id} value={wf.id}>
                      {wf.name}
                    </option>
                  ))}
                </select>

              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 p-2 bg-amber-100 hover:bg-amber-400 cursor-pointer rounded-lg text-neutral-800 font-medium"
              >
                {loading ? "Running..." : "Run automation"}
              </button>
            </form>
          </div>

          <div className="mt-4">
            <strong>Result</strong>
            <div className="mt-2 p-4 max-w-max">
              {!latestExecution && (
                <p className="opacity-50">No execution yet.</p>
              )}

              {latestExecution?.status === "pending" && <p>Processing...</p>}

              {latestExecution?.status === "success" && (
                <p className="rounded-lg p-4 border border-green-400">
                  Automation completed successfully.
                </p>
              )}

              {latestExecution?.status === "error" && (
                <p className="rounded-lg p-4 border border-red-400 text-red-600">
                  {latestExecution.errorMessage || "Execution failed."}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            onClick={handleLogout}
            className="mt-6 p-2 border rounded-sm cursor-pointer hover:opacity-60"
          >
            Logout
          </button>
        </div>

        <hr className="xl:mr-20 my-6" />

        <div className="xl:w-1/2">
          <HistoryPanel history={history} />
        </div>
      </div>
    </main>
  );
}
