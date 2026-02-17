const WEBHOOK_QUEUE_KEY = "webhook-queue";

export type WebhookEvent = {
  executionId: string;
  executeAt: number;
};

export function simulateWebhook(executionId: string) {
  const delay = Math.random() * 2000 + 500;

  const webhookEvent: WebhookEvent = {
    executionId,
    executeAt: Date.now() + delay,
  };

  const queue: WebhookEvent[] = JSON.parse(
    localStorage.getItem(WEBHOOK_QUEUE_KEY) || "[]"
  );

  queue.push(webhookEvent);

  localStorage.setItem(WEBHOOK_QUEUE_KEY, JSON.stringify(queue));
}
