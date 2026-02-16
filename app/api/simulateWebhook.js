// Currently works. but now refresh problem is back, and second refresh does not resolve it
export function simulateWebhook(executionId, setHistory) {
  const delay = Math.random() * 2000 + 500;

  setTimeout(() => {
    const success = Math.random() > 0.2;

    setHistory((prev) =>
      prev.map((item) =>
        item.executionId === executionId
          ? {
              ...item,
              status: success ? "success" : "error",
              result: success
                ? { message: "Completed successfully" }
                : { message: "Execution failed" },
              resolvedAt: Date.now(),
            }
          : item,
      ),
    );
  }, delay);
}
