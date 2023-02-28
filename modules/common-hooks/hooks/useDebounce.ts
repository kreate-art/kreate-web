import * as React from "react";

type NumMilliseconds = number;

const DEFAULT_DELAY = 1000;

type DebouncedOptions = {
  delay?: NumMilliseconds;
  disabled?: boolean;
};

/**
 * Returns the debounced value and a `dirty` flag.
 *
 * - If `dirty` is `false`, `debouncedValue` and `value` are equal.
 * - If `dirty` is `true`, `debouncedValue` is the older version of `value`
 * (the version when `dirty` is switched from `false` to `true`).
 */
export function useDebounce<T>(
  value: T,
  { delay = DEFAULT_DELAY, disabled = false }: DebouncedOptions = {}
) {
  const [debouncedValue, setDebouncedValue] = React.useState(value);
  const [dirty, setDirty] = React.useState(false);

  React.useEffect(() => {
    if (disabled) return;

    setDirty(true);
    const timerId = setTimeout(() => {
      setDebouncedValue(value);
      setDirty(false);
    }, delay);

    return () => {
      clearTimeout(timerId);
    };
  }, [value, delay, disabled]);

  if (disabled) {
    return [value, false] as const;
  }

  return [debouncedValue, dirty] as const;
}
