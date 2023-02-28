import React from "react";

import { ResultT } from "@/modules/async-utils";
import { useMemo$Async } from "@/modules/common-hooks/hooks/useMemo$Async";

type Updater<T> = T extends (...args: unknown[]) => unknown
  ? never
  : T | ((value: T) => T | undefined) | undefined;

/**
 * Similar to `React.useState`, but `initialState` is a function which returns a Promise.
 */
export function useState$Async<T>(
  initialState: (signal: AbortSignal) => Promise<T | undefined>,
  deps: React.DependencyList
): [T | undefined, (state: Updater<T>) => void, unknown] {
  const [resultT, setResultT] = React.useState<ResultT<T> | undefined>(
    undefined
  );

  const [initialState$Result, initialState$Reason] = useMemo$Async<T>(
    async (signal) => {
      if (resultT) return undefined;
      return await initialState(signal);
    },
    { debouncedDelay: 0 },
    [!!resultT, ...deps]
  );

  if (!resultT && initialState$Result !== undefined) {
    setResultT({ ok: true, result: initialState$Result });
  }

  if (!resultT && initialState$Reason !== undefined) {
    setResultT({ ok: false, reason: initialState$Reason });
  }

  const setState = (state: Updater<T>) => {
    setResultT((resultT) => {
      // 1. If the initializer is not finished, cannot setState.
      if (!resultT) {
        console.warn(
          "Cannot setState before the initializer finished. This is a no-op."
        );
        return resultT;
      }

      // 2. If the initializer failed, the only allowed transition is to
      // clear the `resultT`. This change will trigger the initializer
      // to be rerun.
      if (!resultT.ok) {
        if (state === undefined) {
          return undefined;
        } else {
          console.warn(
            "Cannot setState after the initializer failed. This is a no-op."
          );
          return resultT;
        }
      }

      // 3. Otherwise, we calculate the new result then update `resultT` accordingly.
      const newResult: T | undefined =
        typeof state === "function" ? state(resultT.result) : state;
      if (newResult === undefined) {
        return undefined;
      } else {
        return { ok: true, result: newResult };
      }
    });
  };

  const state = resultT && resultT.ok ? resultT.result : undefined;
  const error = resultT && !resultT.ok ? resultT.reason : undefined;
  return [state, setState, error];
}
