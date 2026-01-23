"use client";

import { useState } from "react";
import HistoryPanel from "./components/HistoryPanel";
import { History } from "./atoms/History";
import { useLocalStorage } from "./hooks/useLocalStorage";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useLocalStorage<History[]>("automation-history",[],);
  const [showSuccessOnly, setShowSuccessOnly] = useState(false);

  async function runAutomation() {
    setLoading(true);
    setResult(null);
    setError(null);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const shouldFail = Math.random() < 0.3;
    const timestamp = new Date().toLocaleString();

    if (shouldFail) {
      setError("Automation failed. Please try again.");
      setHistory((prev) => [
        ...prev,
        { name, email, timestamp, status: "error" },
      ]);
    } else {
      setResult(`Automation completed for ${name || "unknown user"}`);
      setHistory((prev) => [
        ...prev,
        { name, email, timestamp, status: "success" },
      ]);
    }

    setLoading(false);
  }

  const visibleHistory = showSuccessOnly ? history.filter((item) => item.status === "success") : history;

  return (
    <main className="max-h-screen mx-auto p-6">
      <h1 className="text-2xl pb-6">Automation Dashboard</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          runAutomation();
        }}
      >
        <div>
          <h2>Name</h2>
          <input
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-amber-100 text-black mt-1"
          />
        </div>

        <div className="mt-4">
          <h2>Email</h2>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-amber-100 text-neutral-800 mt-1"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 p-2 bg-amber-100 hover:bg-amber-400 cursor-pointer rounded-lg text-neutral-800 font-medium"
        >
          {loading ? "Running..." : "Run workflow"}
        </button>
      </form>

      <div className="mt-6">
        <strong>Result</strong>
        <div className="mt-2 p-4 max-w-max">
          {loading && <p>Processing...</p>}
          {!loading && result && (
            <p className="rounded-lg p-4 border">{result}</p>
          )}
          {!loading && error && (
            <p className="rounded-lg p-4 border border-red-400 text-red-600">
              {error}
            </p>
          )}
          {!loading && !result && <p className="opacity-5">No result yet.</p>}
        </div>
      </div>

      <button
        onClick={() => setShowSuccessOnly((prev) => !prev)}
        className="mb-4 px-3 py-1 rounded border text-sm"
      >
        {showSuccessOnly ? "Show all" : "Show success only"}
      </button>

      <HistoryPanel history={visibleHistory} />
    </main>
  );
}
