import * as React from "react";

export function useLocationHash() {
  const [hash, setHash] = React.useState<string | undefined>(undefined);

  // on mount
  React.useEffect(() => {
    setHash(window.location.hash);
  }, []);

  // on hash change
  React.useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash);
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return hash;
}
