"use client";

import { useEffect, useState } from "react";
import HistoryPanel from "../components/HistoryPanel";
import { useExecutions } from "../hooks/useExecutions";
import { createClient } from "../utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { resolveExecutionTimeouts } from "../lib/timeoutResolver";
import Link from "next/link";
import { useAdmin } from "../hooks/useAdmin";

type Workflow = {
  id: string;
  workflow_name: string;
  webhook_path: string;
};

export default function DashboardClient({ user }: { user: User }) {
  const supabase = createClient();

  const [name, setName] = useState("");
  const [email, setEmail] = useState(user.email || "");

  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>("");

  const { executions: history, triggerExecution } = useExecutions([]);

  const loading = history.some((h) => h.status === "pending");

  const [showFirstSuccess, setShowFirstSuccess] = useState(false);

  const isAdmin = useAdmin();

  const latestExecution =
    history.length > 0
      ? [...history].sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        )[0]
      : null;

  // Timeout watchdog
  useEffect(() => {
    const interval = setInterval(() => {
      resolveExecutionTimeouts(history);
    }, 30000);

    return () => clearInterval(interval);
  }, [history]);

  // Fetch workflows on mount
  useEffect(() => {
    const fetchWorkflows = async () => {
      const { data, error } = await supabase
        .from("workflows")
        .select("id, workflow_name, webhook_path")
        .order("created_at", { ascending: true });

      if (!error) {
        setWorkflows(data || []);
      }
    };

    fetchWorkflows();
  }, [supabase]);

  // Persist success banner once per browser/device
  useEffect(() => {
    if (!history.length || !user?.id || typeof window === "undefined") return;

    const hasSuccess = history.some((e) => e.status === "success");
    const key = `seenFirstSuccess_${user.id}`;
    const seen = localStorage.getItem(key);

    // Only update localStorage, don't call setState
    if (hasSuccess && !seen) {
      localStorage.setItem(key, "true");
      queueMicrotask(() => setShowFirstSuccess(true));
    }
  }, [history, user?.id]);

  async function runAutomation() {
    const workflow = workflows.find((wf) => wf.id === selectedWorkflow);

    if (!workflow) {
      console.warn("No workflow selected");
      return;
    }

    await triggerExecution({
      workflowId: workflow.id,
      workflowKey: workflow.webhook_path,
      workflowName: workflow.workflow_name,
      name,
      email,
    });
  }

  async function handleLogout() {
    try {
      await supabase.auth.signOut();
      
      localStorage.clear(); // or be specific (in case): localStorage.removeItem('key')
      
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
    
      window.location.href = "/login";
    }
  }

  return (
    <main className="min-h-screen flex justify-center">
      <div className="max-w-5xl p-10 xl:flex xl:py-12">
        <section className="xl:w-1/2">
          <h1 className="text-2xl pb-4">Client Dashboard: {user.email}</h1>

          {showFirstSuccess && (
            <div className="p-4 mb-4 border rounded-md bg-emerald-900/40">
              <h3 className="font-semibold">
                🎉 Automation Connected Successfully!
              </h3>

              <p className="text-sm opacity-80">
                Your workflow is now sending live executions to your dashboard.
              </p>

              <button
                onClick={() => setShowFirstSuccess(false)}
                className="mt-2 text-sm underline cursor-pointer hover:opacity-70"
              >
                Dismiss
              </button>
            </div>
          )}

          <div className="border rounded-xl min-w-fit p-6 mb-10">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                runAutomation();
              }}
            >
              {isAdmin && (
                <>
                  <div className="">
                    <h2>Name</h2>
                    <input
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
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border border-amber-100 rounded-md py-1 w-3/4 text-emerald-50 mt-1 pl-1 (xl:pr-[40%] sm:pr-[30%])"
                      placeholder="you@example.com"
                    />
                  </div>
                </>
              )}
              <h2
                className={`${!isAdmin && "text-center mb-4 text-2xl"}  my-2`}
              >
                Your Workflows
              </h2>
              <div
                className={`${isAdmin && "justify-between"} flex justify-around`}
              >
                {!workflows.length ? (
                  <>
                    <div className="flex space-x-2">
                      <h2 className="p-1.5">No workflows yet.</h2>
                      <Link
                        href="/dashboard/workflows/new"
                        className="p-1.5 border rounded-md hover:opacity-60"
                      >
                        Add your first workflow
                      </Link>
                    </div>
                  </>
                ) : (
                  <select
                    value={selectedWorkflow}
                    onChange={(e) => setSelectedWorkflow(e.target.value)}
                    className="p-1 border rounded-md hover:opacity-60"
                  >
                    <option value="" className="bg-background">
                      See your workflows
                    </option>
                    {workflows.map((wf) => (
                      <option
                        key={wf.id}
                        value={wf.id}
                        className="bg-background"
                      >
                        {wf.workflow_name}
                      </option>
                    ))}
                  </select>
                )}

                {workflows.length > 0 && (
                  <Link
                    href="/dashboard/workflows/new"
                    className="p-1.5 border rounded-md hover:opacity-60"
                  >
                    Add workflow
                  </Link>
                )}
              </div>

              {isAdmin && (
                <button
                  type="submit"
                  disabled={loading && !selectedWorkflow}
                  className="mt-6 p-2 bg-amber-100 hover:bg-amber-400 cursor-pointer rounded-lg text-neutral-800 font-medium"
                >
                  {loading ? "Running..." : "Run automation"}
                </button>
              )}
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
        </section>

        <hr className="xl:mr-20 my-6" />

        <section className="xl:w-1/2">
          <HistoryPanel history={history} />
        </section>
      </div>
    </main>
  );
}
