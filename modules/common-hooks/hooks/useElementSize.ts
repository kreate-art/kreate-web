import * as React from "react";

export type Size = {
  w: number;
  h: number;
};

/**
 * Watches the size of an element.
 */
export function useElementSize(element: Element | null) {
  const [size, setSize] = React.useState<Size | null>(null);

  React.useEffect(() => {
    if (!element) return;
    const observer = new ResizeObserver(() => {
      setSize({ w: element.clientWidth, h: element.clientHeight });
    });
    observer.observe(element);
    return () => observer.unobserve(element);
  }, [element]);

  return size;
}
