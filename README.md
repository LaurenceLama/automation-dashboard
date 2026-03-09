## Automation Execution Dashboard

A unified monitor for automation runs across platforms (Make, Zapier, n8n, GoHighLevel, etc.). Stop jumping between platform logs — see all your workflow executions in one place.

### In simple terms

Instead of logging into Make, then Zapier, then n8n to check if your automations ran — this dashboard shows everything in one unified view.

### Vision

A monitoring dashboard for automation freelancers that makes workflow activity easy to understand — for both builders and their clients.

**The problem it solves:**

Automation freelancers manage workflows across multiple platforms, but each keeps execution logs buried in its own interface. You have to log into Make, then Zapier, then n8n just to see what ran and what failed. This dashboard gives you one place to monitor everything — and a simple summary to share with clients.

**The solution:**
One dashboard. All your automations. One place to see what's running, what succeeded, and what failed.

### Why this exists (real-world use case)

Automation freelancers often manage 10+ workflows across Make, Zapier, n8n, and other platforms for different clients.

Currently, monitoring requires:

- Logging into Make → checking execution logs
- Logging into Zapier → checking execution logs
- Logging into n8n → checking execution logs
- Manually correlating which automations work, which fail, and which need attention

This dashboard solves that by aggregating all execution data into one unified interface.

### Who this dashboard is for

This dashboard is designed for **automation freelancers and agencies** who manage workflows across multiple platforms and need a single place to monitor execution health.

It is intended for:

- Freelancers managing automations across multiple tools
- Agencies running automations on behalf of multiple clients
- Anyone who needs real-time visibility into workflow execution status
- Teams that want to avoid platform-specific logging interfaces

It is not intended for:

- Building or debugging automations (use the platforms themselves)
- Viewing execution payloads or internal logic trees
- Replacing Make, Zapier, or n8n

Automation platforms handle internals.
This dashboard communicates outcomes.

### What you see in the dashboard

For each workflow execution:

- **Workflow name** — Which automation ran
- **Status** — Pending / Success / Error
- **Timestamp** — When it executed
- **Platform** — Where it ran (Make, Zapier, n8n, etc.)
- **Error details** (if applicable) — Why it failed

### Execution Lifecycle

1. An execution is created with status = "pending"
2. An external automation platform (Make) runs the workflow
3. Make sends a callback webhook with the final result
4. The execution is updated to either:
   - "success"
   - "error"

The dashboard does not assume execution completion until a callback is received.

### Webhook Callback Contract (Make → Dashboard)

Expected payload:
{
workflowKey: string;
name?: string;
email?: string;
}

### Execution State Guarantees

- Every execution displayed starts in pending
- Only one final callback is accepted
- Final states are immutable
- Duplicate or late callbacks are ignored
- Executions do not remain pending indefinitely

### Current features (completed)

- ✅ Real-time execution monitoring
- ✅ Webhook callback handling
- ✅ Execution state management (pending → success/error)
- ✅ Unified dashboard UI

### Next steps

- Export execution history
- Failure execution cards from client workflows (maybe)
- umm
