"use client";

import { useState } from "react";
import HistoryPanel from "./components/HistoryPanel";
import { History } from "./atoms/History";
import { useLocalStorage } from "./hooks/useLocalStorage";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [workflowName, setWorkflowName] = useState("");
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

  // This will later trigger a Make webhook
  async function runAutomation() {
    const executionId = crypto.randomUUID();
    const timestamp = new Date().toISOString();

    const baseExecution: History = {
      executionId,
      name,
      email,
      workflowName,
      timestamp,
      status: "pending",
      trigger: "manual",
    };

    // Create execution
    setHistory((prev) => [...prev, baseExecution]);

    const testFail = Math.random() < 0.3;
    const testTimeout = Math.random()*10000 + 6000; // (dev)   ==  interaction from this - goes to pending, then error status with timeout error message pops on card (in < 10secs), then finalizes to success/error status, bypassing the timeout error status  

    setTimeout(() => {
      setHistory((prev) =>
        prev.map((item) =>
          item.executionId === executionId
            ? {
                ...item,
                status: testFail ? "error" : "success",
                ...(testFail && {
                  errorMessage: "Automation failed. Please try again.",
                }),
              }
            : item,
        ),
      );
    }, testTimeout);

    // In production this will trigger webhook
  }

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
