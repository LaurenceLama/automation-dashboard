"use client";

import { History } from "../atoms/History";

export default function HistoryPanel({ history }: { history: History[] }) {
  return (
    <div className="mt-6">
      <strong>History</strong>

      <div className="mt-2 space-y-2">
        {history.length === 0 && <p className="opacity-40">No runs yet.</p>}

        {history.map((item, index) => (
          <div
            key={index}
            className={`border rounded-lg p-3 mb-6 max-w-max text-sm ${item.status === "error" ? "border-red-400" : "border-green-300"}`}
          >
            <h2>Name: {item.name}</h2>
            <h2>Email: {item.email}</h2>
            <h2>Created since: {item.timestamp}</h2>
            <h2>Status: {item.status}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
