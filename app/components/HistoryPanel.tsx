"use client";

import { History } from "../atoms/History";
import { useState, useEffect } from "react";
import { applyExecutionTimeouts } from "../lib/timeout";

type Filter = "all" | "success" | "error";

export default function HistoryPanel({ history }: { history: History[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  const filteredHistory = history.filter((item) => {
    if (filter === "all") return true;
    return item.status === filter;
  });

  // Will be replaced by server-side job in production.
  // In case pending takes too long, set to timeout - If a callback is not received within a defined window, the execution is treated as failed.
  const timedHistory = applyExecutionTimeouts(filteredHistory);

  // Force re-check timeout every second
  const [, forceRender] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      forceRender((n) => n + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const orderedHistory = [...timedHistory].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  const totalRuns = history.length;
  const successRuns = history.filter(
    (item) => item.status === "success",
  ).length;
  const errorRuns = history.filter((item) => item.status === "error").length;

  const hasPending = timedHistory.some((item) => item.status === "pending");

  // For prioritizing pending executions display (maybe for later versions / if requested)
  // const sortedHistory = [...filteredHistory].sort((a, b) => {
  //   if (a.status === "pending" && b.status !== "pending") return -1;
  //   if (a.status !== "pending" && b.status === "pending") return 1;

  //   return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  // });

  return (
    <div className="">
      <h1 className="text-2xl">Execution history</h1>

      <p className="text-sm mt-2 opacity-60">
        Execution history for manual, webhook, and automated triggers across
        automation tools.
      </p>

      <p className="text-sm mt-6 opacity-80">
        Total runs: {totalRuns} • Success: {successRuns} • Errors: {errorRuns}
      </p>

      <div className="my-4 flex gap-2">
        {(["all", "success", "error"] as Filter[]).map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={
              filter === type
                ? "font-bold border p-2 underline"
                : "cursor-pointer"
            }
            disabled={history.length === 0}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {filteredHistory.length === 0 && (
        <p className="opacity-70 text-md font-medium">
          Executions and statuses will appear here once a workflow runs.
        </p>
      )}

      <div className="mt-2 space-y-6">
        {orderedHistory.map((item) => (
          <div
            key={item.executionId}
            className={`border space-y-1.5 rounded-lg p-3 max-w-max text-sm ${item.status === "error" ? "border-red-400" : "border-green-400"} transition-opacity ${
              hasPending && item.status !== "pending"
                ? "opacity-65"
                : "opacity-100"
            }`}
          >
            {/* {item.status === "pending" && (  // For later versions
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 animate-spin rounded-full border-2 border-amber-400 border-t-transparent"></span>
                <p className="text-xs opacity-70">
                  Waiting for automation platform response...
                </p>
              </div>
            )} */}
            {item.status === "pending" && (
              <div role="status" className="flex items-center gap-2">
                <svg
                  aria-hidden="true"
                  className="inline w-4.5 h-4.5 text-gray-600 animate-spin fill-yellow-400"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
                <p className="text-xs opacity-70">
                  Waiting for automation platform response...
                </p>
              </div>
            )}
            <h2
              className={`inline-block px-2 py-1 rounded ${
                item.status === "pending"
                  ? "bg-yellow-400 text-yellow-900"
                  : item.status === "success"
                    ? "bg-green-200 text-green-900"
                    : "bg-red-200 text-red-900"
              }`}
            >
              Execution status: {item.status.toUpperCase()}
            </h2>
            
            <h2>
              Workflow name: <b>{item.workflowName}</b>
            </h2>
            
            <h2>Created at: {new Date(item.timestamp).toLocaleString()}</h2>
            
            <h2>Name: {item.name}</h2>

            <h2>Email: {item.email}</h2>
            
            <h2>Triggered source: {item.trigger.toUpperCase()}</h2> {/* 'manual' - for demo purposes btw */}
            
            <h2 className="opacity-50">Execution ID: {item.executionId}</h2>

            {item.status === "error" && item.errorType === "timeout" ? (
              <h2 className="opacity-50">Error message: {item.errorMessage}</h2>
            ) : item.status === "success" || item.status === "pending" ? (
              ""
            ) : (
              <h2 className="opacity-50">Error message: ⚠ Timed Out</h2>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
