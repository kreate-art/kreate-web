import * as React from "react";

import { toJson } from "@/modules/json-utils";

export function isAbortError(value: unknown): boolean {
  return value instanceof DOMException && value.name === "AbortError";
}

/**
 * Calculates `fn(input)` and returns the result where `fn` is an async function.
 * Returns `undefined` if the `fn` is running.
 *
 * Notes:
 * - `input` must be serializable. When `toJson(input)` changes, `fn`
 * will be run again.
 * - `fn` should not throw anything other than an abort error. If it throws,
 * the error will only be printed to console and silent to user.
 * - Use `signal` to abort early in case that `input` changes before `fn`
 * finishes running.
 * - To debounce, write
 * `fn = async (input, signal) => { await sleep(1000); signal.throwIfAborted(); ... }`
 */
export function useAsyncComputation<T, R>(
  input: T,
  fn: (input: T, signal: AbortSignal) => Promise<R>
): R | undefined {
  const [result, setResult] = React.useState<R | undefined>(undefined);

  React.useEffect(() => {
    const abortController = new AbortController();

    void (async () => {
      setResult(undefined);
      try {
        const current = await fn(input, abortController.signal);
        abortController.signal.throwIfAborted();
        setResult(current);
      } catch (e) {
        if (isAbortError(e)) return;
        throw e;
      }
    })();

    return () => {
      abortController.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toJson(input)]);
  return result;
}
