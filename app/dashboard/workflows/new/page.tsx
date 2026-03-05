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

  const [creating, setCreating] = useState(false);

  const [createdWorkflow, setCreatedWorkflow] =
    useState<CreatedWorkflow | null>(null);

  async function addWorkflow(e: React.FormEvent) {
    e.preventDefault();

    setCreating(true);

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

    setCreating(false);
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
          <form onSubmit={addWorkflow} className="space-x-4 flex">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded-md p-1"
              placeholder="Fill workflow name here"
            />

            <button
              type="submit"
              disabled={creating}
              className={`border p-1 rounded-md bg-amber-50 text-background font-semibold ${creating && "bg-background border-amber-50"} hover:bg-background hover:border-amber-50 hover:text-amber-50  transition-all ease-in-out duration-200`}
            >
              {creating ? (
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
                  <p className="text-md text-amber-50 opacity-70">
                    Creating...
                  </p>
                </div>
              ) : (
                "Create Workflow"
              )}
            </button>
          </form>
        </section>
      ) : (
        /* ===== INSTRUCTIONS PANEL ===== */
        <section className="space-y-12">
          <h3>✅ Workflow Connected</h3>

          <div>
            <p className="opacity-90">
              Add one final step to your automation so executions appear in your
              dashboard:
            </p>

            <p className="text-sm opacity-60">
              (I recommend you to keep this tab open and open your desired
              workflow to be connected)
            </p>
          </div>

          {/* WEBHOOK URL */}
          <div className="space-y-2">
            <p className="font-semibold text-lg sm:text-xl">
              Step 1 — Add an HTTP/Webhook action
            </p>
            <div className="flex flex-col lg:flex-row max-w-4xl gap-6">
              <div>
                <p className="text-sm sm:text-base">
                  In your automation platform (Make, Zapier, GoHighLevel, etc),
                  add an <strong>HTTP Request</strong> or{" "}
                  <strong>(or Custom Webhook action) </strong>
                  as the step of your workflow.
                  <br />
                  <br />
                  Set the request method to <strong>POST</strong>.
                </p>

                <p className="mt-2 text-sm sm:text-base">POST URL:</p>

                <pre className="overflow-x-auto text-xs sm:text-sm">
                  {webhookUrl.slice(0, 26) + "*******"}
                </pre>

                <button
                  onClick={() => copy(webhookUrl)}
                  className="flex p-1 border rounded-md hover:opacity-60 text-sm sm:text-base"
                >
                  Copy Webhook URL
                </button>
                <br />
              </div>

              <div className="opacity-80 text-xs lg:my-auto">
                <div className="border rounded-xl p-2">
                  <strong>💡 Optional (Recommended)</strong>
                  <p>
                    If your automation platform supports error handlers, you can
                    also add this webhook inside your error route to log failed
                    executions.
                  </p>
                </div>
              </div>
            </div>

            <p className="opacity-90 text-sm sm:text-base">
              After setting the request method to <strong>POST</strong>, choose
              <strong> JSON</strong> as the request body format.
            </p>

            <p className="text-xs sm:text-sm opacity-70">
              (Most platforms automatically set headers for you. If not, then..
              uhh... then it is my time to shine 👍)
            </p>
          </div>

          {/* WORKFLOW KEY */}
          <div className="space-y-2">
            <p className="font-semibold text-lg sm:text-xl">
              Step 2 — Use your Workflow Key
            </p>

            <p className="text-sm sm:text-base">
              A <u>Workflow Key</u> identifies which workflow sent the
              execution.
            </p>

            <pre className="overflow-x-auto text-xs sm:text-sm">
              Workflow Key: {createdWorkflow.webhook_path}
            </pre>

            <button
              onClick={() => copy(createdWorkflow.webhook_path)}
              className="p-1 border rounded-md hover:opacity-60 text-sm sm:text-base"
            >
              Copy Workflow Key
            </button>
          </div>

          {/* PAYLOAD */}
          <div className="space-y-2">
            <p className="font-semibold text-lg sm:text-xl">
              Step 3 — Paste this into the Request Body JSON
            </p>

            <p className="text-sm sm:text-base">
              Paste this inside the <strong>Body</strong> section of your HTTP
              request and choose <strong>Raw → JSON</strong> (or equivalent).
            </p>

            <pre className="overflow-x-auto text-xs sm:text-sm">
              {`{
                "workflowKey": "${createdWorkflow.webhook_path}",
                "name": "{{optional}}",    <- e.g. client name
                "email": "{{optional}}"    <- e.g. client email
              }`}
            </pre>
            <p className="text-sm sm:text-base">
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
              className="p-1 border rounded-md hover:opacity-60 text-sm sm:text-base"
            >
              Copy Payload
            </button>
          </div>

          <p className="text-xs sm:text-sm opacity-80">
            💡 This step reports the execution to your dashboard. If the
            workflow fails before reaching this step, no execution will be
            recorded. <br /> Also, executionId is automatically generated by the
            dashboard. Do NOT include it in your payload.
          </p>

          <div className="space-y-1">
            <strong className="text-sm sm:text-base">⚠️ NOTE </strong>
            <p className="text-sm sm:text-md opacity-80">
              This step reports successful workflow runs. If your automation
              fails before this step, the execution will not appear in the
              dashboard.
            </p>
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            className="w-full sm:w-auto border p-1 rounded-md bg-amber-50 text-background font-semibold hover:bg-background hover:border-amber-50 hover:text-amber-50 transition-all ease-in-out duration-200 text-sm sm:text-base"
          >
            Go to Dashboard
          </button>
        </section>
      )}
    </main>
  );
}
