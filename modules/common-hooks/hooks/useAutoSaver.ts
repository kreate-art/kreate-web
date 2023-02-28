import * as React from "react";

import { useDebounce } from "./useDebounce";

type NumMilliseconds = number;

type UseAutoSaverParams<T> = {
  /**
   * The input value
   *
   * Because this hook implements the debouncing mechanism, there is no need
   * to debounce `value` beforehand.
   **/
  value: T;
  /**
   * The save function, which will be called after `value` changes
   *
   * When `value` changes, `onSave` will not be called immediately. Instead,
   * we will wait until the `dirty` flag from `useDebounce` to be `false`,
   * then call `onSave`. In other words, if `value` is changed at time `T`,
   * `onSave` will be called no earlier than `T + debouncedDelay(ms)`.
   *
   * When `signal.aborted` is `true`, it should throw as soon as possible.
   * It is recommended to call `signal.throwIfAborted()` before writing
   * changes to the persistent layer.
   **/
  onSave: (value: T, signal: AbortSignal) => Promise<void>;
  /**
   * The error handler, which will be called in case that `onSave` throws
   * an error which is not an `AbortError`.
   */
  onError: (error: unknown) => void;
  /**
   * The debounced delay (in milliseconds)
   */
  debouncedDelay?: NumMilliseconds;
  disabled?: boolean;
};

export type AutoSaverStatus =
  | "idle"
  | "waiting"
  | "saving"
  | "success"
  | "failure";

/**
 * Automatically save a value when it is changed.
 *
 * Since `save` is an async function, we implement the debouncing mechanism.
 * It effectively reduces the amount of premature calls to `onSave`.
 */
export function useAutoSaver<T>({
  value,
  onSave,
  onError,
  debouncedDelay,
  disabled,
}: UseAutoSaverParams<T>): AutoSaverStatus {
  const [debouncedValue, dirty] = useDebounce(value, { delay: debouncedDelay });
  const [status, setStatus] = React.useState<AutoSaverStatus>("idle");

  React.useEffect(() => {
    if (disabled || dirty) return;
    const abortController = new AbortController();

    void (async () => {
      try {
        setStatus("saving");
        await onSave(debouncedValue, abortController.signal);
        setStatus("success");
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
        setStatus("failure");
        onError(error);
      }
    })();

    return () => {
      abortController.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled, dirty]);

  return disabled ? "idle" : dirty ? "waiting" : status;
}

export const AUTO_SAVER_STATUS_TO_TEXT: Record<AutoSaverStatus, string> = {
  idle: "",
  waiting: "Saving your changes...",
  saving: "Saving your changes.....",
  success: "Your changes have been saved.",
  failure: "Failed to save changes.",
};

export function formatAutoSaverStatus(status: AutoSaverStatus) {
  return AUTO_SAVER_STATUS_TO_TEXT[status];
}
