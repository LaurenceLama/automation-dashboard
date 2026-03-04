"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/app/utils/supabase/client";

type CreatedWorkflow = {
  name: string;
  webhook_path: string;
};

export default function WorkflowPage() {
  const [name, setName] = useState("");
  const router = useRouter();

  const [createdWorkflow, setCreatedWorkflow] =
    useState<CreatedWorkflow | null>(null);

  async function addWorkflow(e: React.FormEvent) {
    e.preventDefault();

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !name) return;

    const webhookPath = crypto.randomUUID().replace(/-/g, "").slice(0, 16);

    const { error } = await supabase.from("workflows").insert({
      name,
      client_id: user.id,
      email: user.email,
      webhook_path: webhookPath,
    });

    if (error) {
      console.error(error);
      return;
    }

    setCreatedWorkflow({ name, webhook_path: webhookPath });
  }

  const webhookUrl = `https://hook.us2.make.com/${process.env.NEXT_PUBLIC_EXECUTION_WEBHOOK_URL_AFTER_DOT_COM}`;

  function copy(text: string) {
    navigator.clipboard.writeText(text);
  }

  return (
    <main className="min-h-screen p-6 flex items-center justify-center">
      {!createdWorkflow ? (
        /* ===== CREATE FORM ===== */
        <section>
          <Link
            href="/dashboard"
            className="p-1 border rounded-md hover:opacity-60"
          >
            Back to dashboard
          </Link>
          <h2 className="mt-8">Add Workflow</h2>
          <form onSubmit={addWorkflow} className="space-x-4 space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded-md p-1"
              placeholder="Fill workflow name here"
            />

            <button
              type="submit"
              className="border p-1 rounded-md bg-amber-50 text-background font-semibold hover:bg-background hover:border-amber-50 hover:text-amber-50 transition-all ease-in-out duration-200"
            >
              Create Workflow
            </button>
          </form>
        </section>
      ) : (
        /* ===== INSTRUCTIONS PANEL ===== */
        <section className="space-y-8">
          <h3>✅ Workflow Connected</h3>

          <div>
            <p className="opacity-90">
              Add one final step to your automation so executions appear in your
              dashboard:
            </p>
  
            <p className="text-sm opacity-60">
              (I recommend you to keep this tab open and open your desired workflow to be connected)
            </p>
          </div>

          {/* WEBHOOK URL */}
          <div className="space-y-2">
            <p className="font-semibold">Step 1 — Add an HTTP/Webhook action</p>
            <p>
              In your automation platform (Make, Zapier, GoHighLevel, etc), add
              an <strong>HTTP Request</strong> or{" "}
              <strong>(or Custom Webhook action) </strong>
              as the step of your workflow.
              <br />
              Set the request method to <strong>POST</strong>.
            </p>

            <p className="mt-2">POST URL:</p>

            <pre>{webhookUrl.slice(0, 26) + "*******"}</pre>

            <button
              onClick={() => copy(webhookUrl)}
              className="flex p-1 border rounded-md hover:opacity-60"
            >
              Copy Webhook URL
            </button>

            <p className="opacity-90">
              After setting the request method to <strong>POST</strong>, choose
              <strong> JSON</strong> as the request body format.
            </p>

            <p className="text-sm opacity-70">
              (Most platforms automatically set headers for you. If not, then
              uhh... then it is my time to shine 👍)
            </p>
          </div>

          {/* WORKFLOW KEY */}
          <div className="space-y-2">
            <p className="font-semibold">Step 2 — Use your Workflow Key</p>

            <p>
              A <u>Workflow Key</u> identifies which workflow sent the
              execution.
            </p>

            <pre>Workflow Key: {createdWorkflow.webhook_path}</pre>

            <button
              onClick={() => copy(createdWorkflow.webhook_path)}
              className="p-1 border rounded-md hover:opacity-60"
            >
              Copy Workflow Key
            </button>
          </div>

          {/* PAYLOAD */}
          <div className="space-y-2">
            <p className="font-semibold">
              Step 3 — Paste this into the Request Body JSON
            </p>

            <p>
              Paste this inside the <strong>Body</strong> section of your HTTP
              request and choose <strong>Raw → JSON</strong> (or equivalent).
            </p>

            <pre>
              {`{
                "workflowKey": "${createdWorkflow.webhook_path}",
                "name": "{{optional}}",    <- e.g. client name
                "email": "{{optional}}"    <- e.g. client email
                }`}
            </pre>
            <p>
              If <u>email</u> is empty, the dashboard will display only your
              account email.
              <br /> Dashboard format - email: [[ your email ]] [[ optional
              email ]]
            </p>

            <button
              onClick={() =>
                copy(
                  JSON.stringify(
                    {
                      workflowKey: createdWorkflow.webhook_path,
                      name: "{{name}}",
                      email: "{{email}}",
                    },
                    null,
                    2,
                  ),
                )
              }
              className="p-1 border rounded-md hover:opacity-60"
            >
              Copy Payload
            </button>
          </div>

          <p className="text-sm opacity-80">
            💡 This step does NOT start your automation. It only reports
            completed runs to your dashboard. <br /> Also, executionId is
            automatically generated by the dashboard. Do NOT include it in your
            payload.
          </p>

          <button
            onClick={() => router.push("/dashboard")}
            className="border p-1 rounded-md bg-amber-50 text-background font-semibold hover:bg-background hover:border-amber-50 hover:text-amber-50 transition-all ease-in-out duration-200"
          >
            Go to Dashboard
          </button>
        </section>
      )}
    </main>
  );
}
