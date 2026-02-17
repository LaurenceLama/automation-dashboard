"use client";

import { useEffect, useState } from "react";
import HistoryPanel from "./components/HistoryPanel";
import { History } from "./atoms/History";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { applyExecutionTimeouts } from "./lib/timeout";
import { simulateWebhook, WebhookEvent } from "./api/simulateWebhook";
import { ExecutionManager } from "./lib/ExecutionManager";
import { supabase } from "./lib/supabase";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [workflowName, setWorkflowName] = useState("");
  // const [history, setHistory] = useState<any[]>([]);
  const [history, setHistory] = useLocalStorage<History[]>(
    "automation-history",
    [],
  );

  // Derived loading state
  const loading = history.some((h) => h.status === "pending");

  // Always derive latest execution
  const latestExecution =
    history.length > 0
      ? [...history].sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        )[0]
      : null;

  // Execution Recovery Loop
  // ------------------------------------------------
  // Runs every second to reconcile execution state.
  // If a pending execution exceeds the timeout window, it is automatically marked as "error: timeout".
  //
  // This solves the refresh problem:
  // When the user refreshes, in-memory timers are lost.
  // This recovery loop ensures executions never stay stuck in "pending" forever.
  //
  // In production, this acts as a client-side fallback.
  // The primary state resolution should come from webhook callbacks or server updates.
  useEffect(() => {
    const interval = setInterval(() => {
      setHistory((prev) => {
        const recovered = applyExecutionTimeouts(prev);

        if (JSON.stringify(prev) !== JSON.stringify(recovered)) {
          return recovered;
        }

        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [setHistory]);

  // Simulate webhook processor loop
  useEffect(() => {
    const interval = setInterval(() => {
      const queue: WebhookEvent[] = JSON.parse(
        localStorage.getItem("webhook-queue") || "[]",
      );

      const now = Date.now();

      const remaining: WebhookEvent[] = [];

      queue.forEach((event) => {
        if (event.executeAt <= now) {
          const success = Math.random() > 0.2;

          setHistory((prev) =>
            ExecutionManager.resolveExecution(prev, event.executionId, {
              status: success ? "success" : "error",
              result: success
                ? { message: "Completed successfully" }
                : { message: "Execution failed" },
              resolvedAt: Date.now(),
            }),
          );
        } else {
          remaining.push(event);
        }
      });

      localStorage.setItem("webhook-queue", JSON.stringify(remaining));
    }, 500);

    return () => clearInterval(interval);
  }, [setHistory]);

  // This will later trigger a Make webhook
  async function runAutomation() {
    const executionId = crypto.randomUUID();

    const { error } = await supabase.from("executions").insert({
      execution_id: executionId,
      workflow_name: workflowName,
      email,
      status: "pending",
    });

    if (error) {
      console.error(error);
      return;
    }

    // Later: send executionId to Make webhook
  }
  // async function runAutomation() {
  //   const executionId = crypto.randomUUID();
  //   const timestamp = new Date().toISOString();

  //   const baseExecution: History = {
  //     executionId,
  //     name,
  //     email,
  //     workflowName,
  //     timestamp,
  //     status: "pending",
  //     trigger: "manual",
  //   };

  //   // Create execution
  //   setHistory((prev) => ExecutionManager.createExecution(prev, baseExecution));

  //   // Simulate backend webhook resolution
  //   simulateWebhook(executionId);

  //   // Timeout protection
  //   const TIMEOUT_LIMIT = 8000;

  //   setTimeout(() => {
  //     setHistory((prev) =>
  //       ExecutionManager.timeoutExecution(prev, executionId),
  //     );
  //   }, TIMEOUT_LIMIT);
  // }

  return (
    <main className="min-h-screen flex items-center">
      <div className="mx-auto max-w-5xl xl:flex p-10 xl:p-6">
        <div className="xl:w-1/2">
          <div className="mb-10">
            <h1 className="text-2xl pb-4">Automation Dashboard</h1>
            <p className="text-sm opacity-80 max-w-xl">
              {/* A client-safe execution tracker for automation workflows (dev) */}
              Run workflows, track execution status, and monitor automation
              results in one place. Designed for teams using tools like Make,
              Zapier, or GoHighLevel.
            </p>
          </div>

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
                  placeholder="Kyle"
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

              <div className=" mt-4">
                <h2>Workflow name</h2>
                <input
                  required
                  type="text"
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                  className="border border-amber-100 rounded-md py-1 w-3/4 text-emerald-50 mt-1 pl-1 (xl:pr-[40%] sm:pr-[30%])"
                  placeholder="e.g. Lead intake → CRM"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 p-2 bg-amber-100 hover:bg-amber-400 cursor-pointer rounded-lg text-neutral-800 font-medium"
              >
                {loading ? "Running..." : "Simulate execution (dev)"}
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
        </div>

        <hr className="xl:mr-20 my-6" />

        <div className="xl:w-1/2">
          <HistoryPanel history={history} />
          <button
            onClick={() => setHistory([])}
            className="p-1 mt-6 text-xs underline opacity-60 hover:opacity-100 border cursor-pointer"
          >
            Clear history (dev)
          </button>
        </div>
      </div>
    </main>
  );
}
