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

  return (
    <div className="mt-6">
      <strong>Execution log</strong>

      <p className="text-sm mt-2 opacity-60">Total executions: {history.length}</p>

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
              : "border-red-400 cursor-pointer"
          }
        >
          Success
        </button>
        <button
          onClick={() => setFilter("error")}
          className={
            filter === "error"
              ? "font-bold border p-2 max-w-max underline border-red-400 cursor-pointer"
              : "border-red-400 cursor-pointer"
          }
        >
          Error
        </button>
      </div>

      <div className="mt-2 space-y-2">
        {filteredHistory.length === 0 && (
          <p className="opacity-70">
            Run a workflow and track the results here.
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
              Workflow status: {item.status.toUpperCase()}
            </h2>
            <h2>Workflow name: {item.workflowName}</h2>

            <h2>Created since: {item.timestamp}</h2>
            <h2>Name: {item.name}</h2>
            <h2>Email: {item.email}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
