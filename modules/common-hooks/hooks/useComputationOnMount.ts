import * as React from "react";

/**
 * Calls `computation` on mount and returns the value.
 *
 * On the first render and while `computation` is running, (if `computation`
 * is an async function), this hook returns `null`.
 *
 * This is one solution to the React Hydration Error:
 * https://nextjs.org/docs/messages/react-hydration-error
 */
export default function useComputationOnMount<T>(
  computation: () => T | Promise<T>
) {
  const [value, setValue] = React.useState<T | null>(null);
  React.useEffect(() => {
    let unmounted = false;
    Promise.resolve(computation()).then((newValue) => {
      if (unmounted) return;
      setValue(newValue);
    });
    return () => {
      unmounted = true;
      setValue(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return value;
}
