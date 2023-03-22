export function assert(
  condition: unknown,
  message?: string
): asserts condition {
  if (!condition) {
    throw new Error(message || "assertion failed");
  }
}

export function noop() {
  /* ignored */
}

export async function noop$async() {
  /* ignored */
}

export function cached<T>(fn: () => T): () => T {
  let value: T | undefined = undefined;
  return () => {
    if (value === undefined) value = fn();
    return value;
  };
}
