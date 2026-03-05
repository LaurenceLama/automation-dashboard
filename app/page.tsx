"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen px-6 sm:px-0">
      {/* HERO */}
      <section className="pt-24 pb-20 text-center space-y-6">
        <h1 className="text-4xl font-bold">
          Track every automation execution in one dashboard
        </h1>

        <p className="text-lg opacity-80 max-w-3xl mx-auto">
          Monitor success, errors, and execution history from Make, Zapier,
          GoHighLevel, or any webhook automation.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            href="/login"
            className="px-6 py-3 text-amber-900 bg-amber-400 hover:text-amber-400 hover:bg-amber-900 rounded-lg font-semibold"
          >
            Start Free
          </Link>

          <Link href="/dashboard" className="px-6 py-3 border rounded-lg">
            View Demo
          </Link>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-6 border-y">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <p className="text-lg opacity-70">
            Works with your favorite automation platforms
          </p>

          {/* later change to appropriate logos */}
          <div className="flex justify-center gap-10 text-sm font-medium opacity-70 flex-wrap">
            <Image src="/Zapier_logo.svg" alt="n8n.png" width={100} height={100} />
            <Image src="https://cdn.brandfetch.io/idxzQ5rVNK/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1701090513757" alt="n8n.png" width={100} height={100} className="bg-white p-1" />
            <Image src="/ghl.png" alt="n8n.png" width={120} height={120} />
            <Image src="https://n8n.io/brandguidelines/logo-white.svg" alt="n8n.png" width={100} height={100} />
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="py-20 max-w-5xl mx-auto px-6 text-center space-y-6">
        <h2 className="text-3xl font-semibold">
          Automation logs are messy and hard to track
        </h2>

        <p className="opacity-80 max-w-2xl mx-auto">
          Platforms like Make, Zapier, or GoHighLevel show partial logs, but it
          {"'"}s difficult to track which client triggered a workflow, whether
          it succeeded, or when errors occurred.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-10 text-left">
          <div className="p-6 border rounded-xl">
            <h3 className="font-semibold mb-2">No clear history</h3>
            <p className="text-sm opacity-80">
              Executions are scattered across different automation platforms.
            </p>
          </div>

          <div className="p-6 border rounded-xl">
            <h3 className="font-semibold mb-2">Hard to debug</h3>
            <p className="text-sm opacity-80">
              When something fails, it takes time to find out what happened.
            </p>
          </div>

          <div className="p-6 border rounded-xl">
            <h3 className="font-semibold mb-2">Client tracking</h3>
            <p className="text-sm opacity-80">
              Knowing which client triggered which automation is often unclear.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-neutral-50 dark:bg-neutral-900">
        <div className="max-w-5xl mx-auto px-6 space-y-10">
          <h2 className="text-3xl font-semibold text-center">
            Connect your automation in minutes
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 border rounded-xl space-y-2">
              <h3 className="font-semibold">1. Create a workflow</h3>
              <p className="text-sm opacity-80">
                Generate a unique workflow key inside the dashboard.
              </p>
            </div>

            <div className="p-6 border rounded-xl space-y-2">
              <h3 className="font-semibold">2. Add one webhook step</h3>
              <p className="text-sm opacity-80">
                Place a simple HTTP request at the end of your automation.
              </p>
            </div>

            <div className="p-6 border rounded-xl space-y-2">
              <h3 className="font-semibold">3. See executions instantly</h3>
              <p className="text-sm opacity-80">
                Every automation run appears in your execution dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 max-w-5xl mx-auto px-6 space-y-10">
        <h2 className="text-3xl font-semibold text-center">
          Built for automation builders
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 border rounded-xl">
            <h3 className="font-semibold mb-2">Execution history</h3>
            <p className="text-sm opacity-80">
              View all automation runs with timestamps and status.
            </p>
          </div>

          <div className="p-6 border rounded-xl">
            <h3 className="font-semibold mb-2">Success & error tracking</h3>
            <p className="text-sm opacity-80">
              Quickly identify failed automations and investigate errors.
            </p>
          </div>

          <div className="p-6 border rounded-xl">
            <h3 className="font-semibold mb-2">Client identification</h3>
            <p className="text-sm opacity-80">
              Track which client triggered each workflow execution.
            </p>
          </div>

          <div className="p-6 border rounded-xl">
            <h3 className="font-semibold mb-2">Universal webhook</h3>
            <p className="text-sm opacity-80">
              Works with Make, Zapier, GoHighLevel, or any automation platform.
            </p>
          </div>
        </div>
      </section>

      {/* SCREENSHOT */}
      <section className="relative max-w-3xl mx-auto py-20 text-center">
        <h2 className="text-3xl font-semibold mb-10">
          Your automation command center
        </h2>

        <div className="relative w-full xl:h-140">
          <Image
            src="/dashboard-preview.svg"
            alt="dashboard-preview.png"
            width={600}
            height={500}
            priority
            className="rounded-xl border border-neutral-800 mx-auto w-full h-auto"
            style={{ color: "#ededed" }}
          />
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-24 text-center space-y-6">
        <h2 className="text-3xl font-semibold">
          Start tracking your automations today!
        </h2>

        <p className="opacity-80">Set up your first workflow in minutes.</p>

        <Link
          href="/login"
          className="inline-block px-8 py-3 text-amber-900 bg-amber-400 hover:text-amber-400 hover:bg-amber-900 rounded-lg font-semibold"
        >
          Create Free Account
        </Link>
      </section>
    </main>
  );
}
