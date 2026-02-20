"use client";

import { useEffect, useState } from "react";
import HistoryPanel from "../../components/HistoryPanel";
import { History } from "../../atoms/History";
import { useExecutions } from "../../hooks/useExecutions";
import { applyExecutionTimeouts } from "../../lib/timeout";
import { supabase } from "../../lib/supabase";
import { useParams } from "next/navigation";

export default function ClientDashboard() {
  const params = useParams();
  const clientId = params.clientId as string;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [workflowName, setWorkflowName] = useState("");

  const [history, setHistory] = useExecutions<History[]>(
    `automation-history-${clientId}`,
    [],
  );

  const loading = history.some((h) => h.status === "pending");

  const latestExecution =
    history.length > 0
      ? [...history].sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        )[0]
      : null;

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

  async function runAutomation() {
    const executionId = crypto.randomUUID();

    const newExecution: History = {
      executionId,
      workflowName,
      name,
      email,
      status: "pending",
      timestamp: new Date().toISOString(),
      trigger: "manual",
    };

    const { error } = await supabase.from("executions").insert({
      execution_id: executionId,
      client_id: clientId,
      workflow_name: workflowName,
      name,
      email,
      status: "pending",
      trigger: "manual",
    });

    if (error) {
      console.error(error);
      return;
    }

    setHistory((prev) => [newExecution, ...prev]);

    await fetch("https://hook.us2.make.com/vghpnamt50dz2h9u70ed9byhmo7yii42", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        executionId,
        email,
        workflowName,
        clientId,
      }),
    });
  }

  return (
    <main className="min-h-screen flex items-center">
      <div className="mx-auto max-w-5xl xl:flex p-10 xl:p-6">

        <div className="xl:w-1/2">

          <h1 className="text-2xl pb-4">
            Client Dashboard: {clientId}
          </h1>

          <div className="border rounded-xl min-w-fit p-6 mb-10">

            <form
              onSubmit={(e) => {
                e.preventDefault();
                runAutomation();
              }}
            >

              <input
                required
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border rounded-md py-1 w-full mb-2 pl-2"
              />

              <input
                required
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border rounded-md py-1 w-full mb-2 pl-2"
              />

              <input
                required
                type="text"
                placeholder="e.g. Lead intake → CRM"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                className="border rounded-md py-1 w-full mb-2 pl-2"
              />

              <button
                type="submit"
                disabled={loading}
                className="mt-4 p-2 bg-amber-100 hover:bg-amber-400 rounded-lg"
              >
                {loading ? "Running..." : "Run Automation"}
              </button>

            </form>

          </div>

          {latestExecution?.status === "success" && (
            <p className="border border-green-400 p-4">
              Success
            </p>
          )}

        </div>

        <div className="xl:w-1/2">
          <HistoryPanel history={history} />
        </div>

      </div>
    </main>
  );
}