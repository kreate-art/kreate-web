import * as React from "react";

/**
 * Shows a confirmation dialog when user closes tab.
 */
export function useConfirmationOnWindowClose(enabled: boolean) {
  React.useEffect(() => {
    if (!enabled) return;

    const beforeUnloadHandler = (event: BeforeUnloadEvent) => {
      // https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event
      event.preventDefault();
      return (event.returnValue = "Are you sure you want to exit?");
    };

    window.addEventListener("beforeunload", beforeUnloadHandler);

    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, [enabled]);
}
