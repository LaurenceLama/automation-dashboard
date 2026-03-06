## Automation Execution Dashboard
A client-safe dashboard for small businesses to monitor automation runs (Make, GHL, Zapier, etc.) without giving them access to the automation platform.


### In simple terms

This dashboard shows whether your automations ran successfully — without you needing to access or understand the automation tools behind them.


### Vision

This repo aims for a lightweight execution dashboard that lets teams see how automations run across tools like Make, Zapier, and GoHighLevel — without jumping between platforms.

Automation platforms already provide execution logs, but they are:

- Tool-specific
- Not client-facing
- Fragmented across systems

This dashboard acts as a unified, client-safe execution layer that standardizes how runs are viewed regardless of trigger source.

This dashboard gives clients visibility into automation runs without exposing the automation platform itself.


### Why this exists (real-world use case)

Agencies often build automations for clients using tools like Make or Zapier.

Clients want to know whether things are working — but do not want access to those tools.

So, this dashboard solves that gap by providing a client-safe execution view while keeping automation internals private.


### Who this dashboard is for

This dashboard exists so that clients can see whether automations are working — without logging into Make, Zapier, or internal tools.

This dashboard is designed for client-facing visibility, not automation configuration.

It is intended for:

- Clients who want to know whether automations ran successfully
- Clients who do not want access to internal automation tools (Make, Zapier, etc.)
- Agencies or freelancers managing automations on behalf of clients
- Retainer-based automation work where ongoing reliability matters

It is not intended for:

- Debugging or building automations
- Viewing raw execution trees, payloads, or internal logic
- Replacing automation platforms like Make or Zapier

Automation platforms handle internals.
This dashboard communicates outcomes.


### What clients see vs What I handle

What clients see

- Workflow name
- Status (pending / success / error)
- Timestamp
- Optional error message


What I handle

- Automation platform setup (Make, GHL, etc.)
- Webhooks & callbacks
- Dashboard advancements & troubleshooting
- Error handling & retries
- Execution tracking logic


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


### Planned integrations

- Make (webhooks & callbacks)

- GoHighLevel

- Other webhook-based automation tools

### Next steps (planned)

- Replace mock execution with Make webhook trigger DONE
- Support webhook callbacks for success/error updates DONE
- Add execution states (pending → success/error) DONE
- Role-based or client-safe views DONE