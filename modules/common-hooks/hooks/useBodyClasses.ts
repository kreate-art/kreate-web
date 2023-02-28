import * as React from "react";

/**
 * Applies classes to `document.body` on mount,
 * and reverts the changes on unmount.
 */
export default function useBodyClasses(classes: string[]) {
  React.useEffect(() => {
    const changes = classes.filter(
      (item) => !document.body.classList.contains(item)
    );
    document.body.classList.add(...changes);
    return () => {
      document.body.classList.remove(...changes);
    };
    // Note: @sk-kitsune: because `classes` might be referentially unstable,
    // we write `...classes` instead of `classes` in the deps array.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...classes]);
}
