"use client";

import { useState, useEffect } from "react";
import HistoryPanel from "./components/HistoryPanel";
import { History } from "./atoms/History";
import { useLocalStorage } from "./hooks/useLocalStorage";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  // const [loading, setLoading] = useState(false); to be deleted
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [workflowName, setWorkflowName] = useState("");
  const [history, setHistory] = useLocalStorage<History[]>(
    "automation-history",
    [],
  );

  const loading = history.some((h) => h.status === "pending");

  // useEffect(() => {    *temp solution for fixing timeout logic - might be removed I think
  //   if (!hasPending && loading) {
  //     // setLoading(false); 
  //     setError(null);
  //   }
  // }, [hasPending, loading]);

  function handleExecutionTimeout() {
    // setLoading(false); to be deleted
    setError("Execution timed out bro."); // might mess up a scenario where card has error status but did not reached the timeout period
  }

  // This will later trigger a Make webhook
  async function runAutomation() {
    // setLoading(true); to be deleted
    setResult(null);
    setError(null);

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

    const SIMULATE_PLATFORM_RESPONSE = false;

    // Current Bug: if there is a previous card with a timeout error message, proceeding cards after it have the error displaying instead of {loading && <p>Processing...</p>}
    if (SIMULATE_PLATFORM_RESPONSE) {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const shouldFail = Math.random() < 0.3;

      setHistory((prev) =>
        prev.map((item) =>
          item.executionId === executionId
            ? {
                ...item,
                status: shouldFail ? "error" : "success",
                ...(shouldFail && {
                  errorMessage: "Automation failed. Please try again.",
                }),
              }
            : item,
        ),
      );

      // if (shouldFail) {
      //   setError("Automation failed. Please try again.");
      // } else {
      //   setResult(`Automation completed for ${name || "unknown user"}`);
      // }

      // setLoading(false); to be deleted
      return;
    }
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
              {loading && <p>Processing...</p>}
              {!loading && result && (
                <p className="rounded-lg p-4 border">{result}</p>
              )}
              {!loading && !result && error && (
                <p className="rounded-lg p-4 border border-red-400 text-red-600">
                  {error}
                </p>
              )}
              {!loading && !result && !error && (
                <p className="opacity-50">No result yet.</p>
              )}
            </div>
          </div>
        </div>

        <hr className="xl:mr-20 my-6" />

        <div className="xl:w-1/2">
          <HistoryPanel history={history} onTimeout={handleExecutionTimeout} />
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
