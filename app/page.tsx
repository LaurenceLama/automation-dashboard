"use client";

import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  return (
    <main style={{ padding: "24px", maxWidth: "600px" }}>
      <h1>Automation Control Panel</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setLoading(true);
          setResult(null);

          setTimeout(() => {
            setResult(`Automation completed for ${name || "unknown user"}`);
            setLoading(false);
          }, 1500);
        }}
      >
        <div>
          <label>Name</label>
          <br />
          <input
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div style={{ marginTop: "12px" }}>
          <label>Email</label>
          <br />
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button type="submit" disabled={loading} style={{ marginTop: "16px" }}>
          {loading ? "Running..." : "Run automation"}
        </button>
      </form>

      <div style={{ marginTop: "24px" }}>
        <strong>Result</strong>
        <div style={{ marginTop: "8px" }}>
          {loading && <p>Processing...</p>}
          {!loading && result && <p>{result}</p>}
          {!loading && !result && <p>No result yet.</p>}
        </div>
      </div>

    </main>
  );
}
