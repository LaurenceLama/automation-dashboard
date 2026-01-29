"use client";

import { History } from "../atoms/History";
import { useState } from "react";

type Filter = "all" | "success" | "error";

export default function HistoryPanel({ history }: { history: History[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  const filteredHistory = history.filter((item) => {
    if (filter === "all") return true;
    return item.status === filter;
  });

  const totalRuns = history.length;
  const successRuns = history.filter(
    (item) => item.status === "success",
  ).length;
  const errorRuns = history.filter((item) => item.status === "error").length;

  return (
    <div className="">
      <h1 className="text-2xl">Execution history</h1>

      <p className="text-sm mt-2 opacity-80">
        Total runs: {totalRuns} • Success: {successRuns} • Errors: {errorRuns}
      </p>

      <div className="my-4 flex gap-2">
        <button
          onClick={() => setFilter("all")}
          className={
            filter === "all"
              ? "font-bold border p-2 max-w-max underline cursor-pointer"
              : "cursor-pointer"
          }
        >
          All
        </button>
        <button
          onClick={() => setFilter("success")}
          className={
            filter === "success"
              ? "font-bold border p-2 max-w-max underline border-green-400 cursor-pointer"
              : "border-red-400 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          }
          disabled={history.length === 0}
        >
          Success
        </button>
        <button
          onClick={() => setFilter("error")}
          className={
            filter === "error"
              ? "font-bold border p-2 max-w-max underline border-red-400 cursor-pointer"
              : "border-red-400 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          }
          disabled={history.length === 0}
        >
          Error
        </button>
      </div>

      <div className="mt-2 space-y-2">
        {filteredHistory.length === 0 && (
          <p className="mb-4 opacity-70 text-md font-medium">
            Executions and statuses will appear here once a workflow runs.
          </p>
        )}

        {filteredHistory.map((item) => (
          <div
            key={`${item.timestamp}-${item.email}`}
            className={`border rounded-lg p-3 mb-6 max-w-max text-sm ${item.status === "error" ? "border-red-400" : "border-green-400"}`}
          >
            <h2
              className={`inline-block px-2 py-1 rounded ${
                item.status === "success"
                  ? "bg-green-200 text-green-900"
                  : "bg-red-200 text-red-900"
              }`}
            >
              Execution status: {item.status.toUpperCase()}
            </h2>
            <h2>
              Workflow name: <b>{item.workflowName}</b>
            </h2>
            <h2>Created at: {item.timestamp}</h2>
            <h2>Name: {item.name}</h2>
            <h2>Email: {item.email}</h2>
            <h2>Triggered via: {item.trigger}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
