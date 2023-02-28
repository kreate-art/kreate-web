import React from "react";

import { ResultT, sleep } from "@/modules/async-utils";
import { isAbortError } from "@/modules/common-hooks/hooks/useAsyncComputation";

/**
 * Similar to `React.useMemo`, but `fn` is a function which returns a Promise.
 * Returns `[result, reason]`:
 * - `[undefined, undefined]`: If `fn` is still running or returned `undefined`.
 * - `[result, undefined]`: If `fn` is finished and returned `result`.
 * - `[undefined, reason]`: If `fn` is finished and threw `reason`.
 */
export function useMemo$Async<T>(
  fn: (signal: AbortSignal) => Promise<T | undefined>,
  { debouncedDelay }: { debouncedDelay: number },
  deps: React.DependencyList
): [T | undefined, unknown] {
  const [resultT, setResultT] = React.useState<ResultT<T> | undefined>(
    undefined
  );

  React.useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    void (async () => {
      setResultT(undefined);
      try {
        await sleep(debouncedDelay);
        signal.throwIfAborted();
        const result = await fn(signal);
        signal.throwIfAborted();
        if (result === undefined) {
          setResultT(undefined);
        } else {
          setResultT({ ok: true, result });
        }
      } catch (error) {
        if (isAbortError(error)) return;
        setResultT({ ok: false, reason: error });
      }
    })();

    return () => {
      abortController.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  const result = resultT && resultT.ok ? resultT.result : undefined;
  const reason = resultT && !resultT.ok ? resultT.reason : undefined;
  return [result, reason];
}
